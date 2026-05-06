import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");

  const onSubmitHandler = async (e) => {
  e.preventDefault();
  axios.defaults.withCredentials = true;

  try {
    if (state === "Sign Up") {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/register`,
        { fullname, username, email, password }
      );

      if (data.success) {
        toast.success("Registration Successful!");

      
        setState("Login");
      } else {
        toast.error(data.message);
      }

    } else {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/login`,
        { identifier, password }
      );

      if (data.success) {
        toast.success("Welcome Back!");
        setTimeout(async () => {
          await getUserData();
          navigate("/dashboard");
        }, 200);

      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
    console.error(error);
  }
};

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] px-4 overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] rounded-2xl w-full sm:w-[400px] text-white overflow-hidden relative"
      >
        {/* Tabs */}
        <div className="relative flex w-full">
          {["Login", "Sign Up"].map((label) => (
            <button
              key={label}
              onClick={() => setState(label)}
              className={`w-1/2 py-3 text-lg font-semibold transition ${
                state === label
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
          <motion.div
            layout
            className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 to-purple-500 ${
              state === "Sign Up" ? "translate-x-full" : ""
            }`}
            style={{ width: "50%" }}
          />
        </div>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              onClick={() => navigate("/")}
              src="/dropbox.png"
              alt="logo"
              className="w-14 cursor-pointer hover:scale-110 hover:drop-shadow-[0_0_20px_#22d3ee] transition"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                {state === "Sign Up" ? "Create Account" : "Welcome Back"}
              </h2>

              <form onSubmit={onSubmitHandler}>
                {state === "Sign Up" && (
                  <>
                    <Input icon={assets.person_icon} placeholder="Full Name" value={fullname} setValue={setFullName} />
                    <Input icon={<FaUser />} placeholder="Username" value={username} setValue={(v) => setUserName(v.toLowerCase())} />
                    <Input icon={assets.mail_icon} placeholder="Email" type="email" value={email} setValue={(v) => setEmail(v.toLowerCase())} />
                  </>
                )}

                {state === "Login" && (
                  <Input
                    icon={assets.mail_icon}
                    placeholder="Username or Email"
                    value={identifier}
                    setValue={(v) => setIdentifier(v.toLowerCase())}
                  />
                )}

                <Input
                  icon={assets.lock_icon}
                  placeholder="Password"
                  type="password"
                  value={password}
                  setValue={setPassword}
                />

                {state === "Login" && (
                  <p
                    onClick={() => navigate("/reset-password")}
                    className="text-gray-400 text-right text-sm mb-4 cursor-pointer hover:text-cyan-400"
                  >
                    Forgot password?
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition"
                >
                  {state}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-xs text-gray-500 mt-4">
            Admin account?{" "}
            <span
              onClick={() => navigate("/admin-login")}
              className="cursor-pointer underline hover:text-white"
            >
              Admin Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* 🔥 Reusable Input Component */
const Input = ({ icon, placeholder, value, setValue, type = "text" }) => (
  <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/5 border border-white/10 focus-within:border-cyan-400 focus-within:bg-white/10 transition">
    {typeof icon === "string" ? (
      <img src={icon} alt="" />
    ) : (
      icon
    )}
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
      placeholder={placeholder}
      className="bg-transparent outline-none w-full text-white placeholder-gray-400"
      required
    />
  </div>
);