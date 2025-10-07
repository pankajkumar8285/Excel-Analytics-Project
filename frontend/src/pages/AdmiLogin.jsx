import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, getAdminData } = useContext(AppContext);
  const [state, setState] = useState("Admin Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (state === "Admin Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/v1/admin/register`, {
          fullName,
          email,
          password,
        });

        if (data.success) {
          toast.success("Admin Registration Successful");
          await getAdminData();
          setState("Admin Login");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post(`${backendUrl}/api/v1/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          toast.success("Welcome Admin!");
          await getAdminData();
          navigate("/admin-dashboard");
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full sm:w-[400px] text-white overflow-hidden relative"
      >
        {/* 🟢 Animated Switch Tabs */}
        <div className="relative flex w-full">
          {["Admin Login", "Admin Sign Up"].map((label) => (
            <button
              key={label}
              onClick={() => setState(label)}
              className={`relative w-1/2 py-3 text-center text-lg font-semibold transition-all duration-300 ${
                state === label ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
          <motion.div
            layout
            className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full transition-all duration-500 ${
              state === "Admin Sign Up" ? "translate-x-full" : ""
            }`}
            style={{
              width: "50%",
            }}
          />
        </div>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              onClick={() => navigate("/")}
              src="/dropbox.png"
              alt="Logo"
              className="w-14 cursor-pointer hover:scale-105 transition-transform"
            />
          </div>

          {/* Form Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-md">
                {state === "Admin Sign Up"
                  ? "Create Admin Account"
                  : "Welcome Back, Admin!"}
              </h2>

              <form onSubmit={onSubmitHandler}>
                {state === "Admin Sign Up" && (
                  <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/20 focus-within:bg-white/30 transition">
                    <img src={assets.person_icon} alt="" />
                    <input
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      className="bg-transparent outline-none w-full placeholder-white/80"
                      type="text"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/20 focus-within:bg-white/30 transition">
                  <img src={assets.mail_icon} alt="" />
                  <input
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    value={email}
                    className="bg-transparent outline-none w-full placeholder-white/80"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/20 focus-within:bg-white/30 transition">
                  <img src={assets.lock_icon} alt="" />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="bg-transparent outline-none w-full placeholder-white/80"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>

                {state === "Admin Login" && (
                  <p
                    onClick={() => navigate("/reset-password")}
                    className="text-indigo-200 text-right cursor-pointer text-sm mb-3 hover:underline"
                  >
                    Forgot password?
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2.5 rounded-full bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg hover:bg-indigo-100 transition-all"
                >
                  {state}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Switch to User Account */}
          <p className="text-center text-xs text-indigo-100 mt-4">
            User account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer underline hover:text-white"
            >
              User Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
