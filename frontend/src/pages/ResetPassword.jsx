import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const { backendUrl } = useContext(AppContext);

  axios.defaults.withCredentials = true;

  const inputRefs = useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backsapce" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus(0);
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/user/reset-otp`, {
        email,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/reset-password`,
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 p-4">
      <div className="w-full max-w-md">
        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg text-sm"
          >
            <img
              onClick={() => navigate("/")}
              src="/dropbox.png"
              alt="Logo"
              className="w-12 mx-auto mb-4 cursor-pointer"
            />
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your registered email address
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="mail" />
              <input
                type="email"
                placeholder="Email id"
                className="bg-transparent outline-none text-white w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
              Submit
            </button>
          </form>
        )}

        {isEmailSent && !isOtpSubmited && (
          <form
            onSubmit={onSubmitOtp}
            className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg text-sm mt-6 w-full max-w-md mx-auto"
          >
            <img
              onClick={() => navigate("/")}
              src="/dropbox.png"
              alt="Logo"
              className="w-12 mx-auto mb-4 cursor-pointer"
            />
            <h1 className="text-center text-2xl font-semibold text-white mb-4">
              Reset Password OTP
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the 6-digit code sent to your email.
            </p>

            <div
              className="flex flex-wrap justify-center gap-3 mb-6"
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>

            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
              Submit
            </button>
          </form>
        )}

        {isEmailSent && isOtpSubmited && (
          <form
            onSubmit={onSubmmitNewPassword}
            className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg text-sm mt-6"
          >
            <img
              onClick={() => navigate("/")}
              src="/dropbox.png"
              alt="Logo"
              className="w-12 mx-auto mb-4 cursor-pointer"
            />
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter new Password below
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="lock" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none text-white w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
