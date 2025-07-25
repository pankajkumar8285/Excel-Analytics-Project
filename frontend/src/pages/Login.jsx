import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
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
          {
            fullname,
            username,
            email,
            password,
          }
        );

        if (data.success) {
          alert("Registration Successful");
          await getUserData();
          setState("Login");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/v1/user/login`, {
          identifier,
          password,
        });

        if (data.success) {
          navigate("/dashboard");
          await getUserData();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-6 sm:px-none bg-gradient-to-br  from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg  shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <div className="flex justify-center mb-4">
          <img
            onClick={() => navigate("/")}
            src="/dropbox.png"
            alt=""
            className="w-10 sm:w-12"
          />
        </div>

        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.person_icon} alt="" />
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullname}
                  className="bg-transparent outline-none"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <FaUser className="text-gray-500" />
                <input
                  onChange={(e) => setUserName(e.target.value.toLowerCase())}
                  value={username}
                  className="bg-transparent outline-none"
                  type="text"
                  placeholder="username"
                  required
                />
              </div>
            </>
          )}

          {state === "Sign Up" ? (
            <>
           
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="" />
                <input
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  value={email}
                  className="bg-transparent outline-none"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
            </>
          ) : (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="" />
              <input
                onChange={(e) => setIdentifier(e.target.value.toLowerCase())}
                value={identifier}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Username or Email"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot password?
            </p>
          )}

          <button className="w-full py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account? {"  "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account? {"  "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
        <p className="text-gray-400 text-center text-xs mt-4">
          Admin account!  {"   "}
          <span onClick={() => navigate('/admin-login')} className="text-blue-400 cursor-pointer underline">Admin Login</span>
        </p>
      </div>
    </div>
  );
};
