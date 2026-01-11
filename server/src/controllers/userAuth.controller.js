import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { transporter } from "../db/nodemailer.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const userSingnUp = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    throw new ApiError(400, "All field are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Email id already registered");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // if(!avatarLocalPath) {
  //     throw new ApiError(404, "Avatar file required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if(!avatar) {
  //     throw new ApiError(400, "Avatar image is required")
  // }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(404, "Something went wrong while registering the user");
  }

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Welcome to InsightGrid",
    text: `Welcome to InsightGrid website. Your account has been created with email id : ${email} `,
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const userSignIn = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new ApiError(400, "Identifier and password are required");
  }


  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Incorrect user credientials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,       
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
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
    secure: true,       
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,       
      sameSite: "none",
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "access token refresh"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const resetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
  await user.save();

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
    throw new ApiError(400, "All field are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.resetOtp === "" || user.resetOtp !== otp) {
    throw new ApiError(401, "Invaild otp");
  }

  if (user.resetOtpExpireAt < Date.now()) {
    throw new ApiError(401, "otp expired");
  }

  user.password = newPassword;
  user.resetOtp = "";
  user.resetOtpExpireAt = 0;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully rest the password"));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar file not received");
  }

  const avatarPath = req.file.path;
  console.log("Avatar Path:", avatarPath);

  const file = await uploadOnCloudinary(avatarPath);
   

  if (!file || !file.secure_url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.avatar = file.secure_url; 
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, file.secure_url, "Avatar updated"));
});


const editProfile = asyncHandler(async (req, res) => {
  const { fullname, username } = req.body;

  
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

 
  if (username && username !== user.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError(400, "Username Already taken")
    }
  }

  
  if (fullname) user.fullname = fullname;
  if (username) user.username = username;

  
  await user.save();

  return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});



const getCurrentUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, avatar } = req.user;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { fullname, username, email, avatar },
        "Current user fetched successfully"
      )
    );
});

export {
  userSingnUp,
  userSignIn,
  logoutUser,
  resetOtp,
  resetPassword,
  getCurrentUser,
  uploadAvatar,
  editProfile
};
