import { Admin } from "../models/admin.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { transporter } from "../../db/nodemailer.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
  const admin = await Admin.findById(userId);
  const adminAccessToken = await admin.generateAccessToken(userId);
  const adminRefreshToken = await admin.generateRefreshToken(userId);

  admin.adminRefreshToken = adminRefreshToken;
  await admin.save();
  return { adminAccessToken, adminRefreshToken };

  }  catch (error) {
      throw new ApiError(
        400,
        "Something went wrong while generating access and refresh token"
      );
};
}

const adminSignUp = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;


  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await Admin.findOne({ email });
  if (existedAdmin) {
    throw new ApiError(409, "Email is already registered");
  }

  const admin = await Admin.create({
    fullName,
    email,
    password,
  });

  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  if (!createdAdmin) {
    throw new ApiError(400, "Failed to create admin");
  }

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Welcome to InsightGrid",
    text: `Hello ${fullName},\n\nWelcome to InsightGrid! Your admin account has been created successfully with the email: ${email}.\n\nBest regards,\nInsightGrid Team`,
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(201)
    .json(new ApiResponse(201, createdAdmin, "Admin created successfully"));
});

const adminSignIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const admin = await Admin.findOne({ email });
  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "wrong password");
  }

  const { adminAccessToken, adminRefreshToken } = await generateAccessAndRefreshToken(
    admin
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };
  return res
    .status(200)
    .cookie("adminAccessToken", adminAccessToken, options)
    .cookie("adminRefreshToken", adminRefreshToken, options)
    .json(new ApiResponse(200, { admin: loggedInAdmin }, "Admin login successfully"));
});

const logOutAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  return res
    .status(200)
    .clearCookies("adminAccessToken", options)
    .clearCookies("adminRefreshToken", options)
    .json(new ApiResponse(200, {}, "Admin logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.ADMIN_REFRESH_TOKEN_SECRET
  );

  const admin = await Admin.findById(decodedToken?._id);

  if (!admin) {
    throw new ApiError(400, "Invalid refresh Token");
  }

  if (incomingRefreshToken !== admin?.refreshToken) {
    throw new ApiError(400, "Refresh Token is expired");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(
    admin._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "access token refreshed"
      )
    );
});

const updateAdminAvatar = asyncHandler(async (req, res) => {

  if (!req.file) {
    throw new ApiError(400, "Avatar file not received");
  }


  const admin = await Admin.findById(req.admin._id);

  const avatarLocalPath = req.file.path;
  const file = await uploadOnCloudinary(avatarLocalPath);


  admin.avatar = file.url;
  await admin.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, file.url, "avatar uploaded successfully"));
});

const resetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const admin = await Admin.findOne(email);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  admin.resetOtp = otp;
  admin.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
  admin.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for resetting your password is  ${otp}. Use this OTP to proceed with resetting your password `,
  };

  await transporter.sendMail(mailOptions);

  return res.status(200).json(new ApiResponse(200, {}, ""));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "All fields are meditory");
  }
  const admin = await Admin.findOne(email);

  if (!admin) {
    throw new ApiError(404, "Admin not found with this email");
  }

  if (admin.resetOtp !== otp) {
    throw new ApiError(400, "Invalid otp");
  }

  if (admin.resetOtpExpireAt < Date.now()) {
    throw new ApiError(400, "otp expired");
  }

  admin.password = newPassword;
  admin.resetOtp = "";
  admin.resetOtpExpireAt = 0;
  await admin.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "successfully reset the password"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, avatar } = req.admin;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { fullName, email, avatar },
        "current admin fetched successfully"
      )
    );
});

export {
  adminSignIn,
  adminSignUp,
  logOutAdmin,
  resetOtp,
  resetPassword,
  updateAdminAvatar,
  refreshAccessToken,
  getCurrentAdmin,
};
