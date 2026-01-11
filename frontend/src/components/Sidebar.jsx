import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaFileAlt,
  FaChartBar,
  FaHistory,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { HiOutlineLogout } from "react-icons/hi";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const navItems = [
  { label: "Dashboard", icon: <FaChartBar />, path: "/dashboard" },
  { label: "AI Insight", icon: <GiArtificialIntelligence />, path: "/insight" },
  { label: "Analyze Data", icon: <FaFileAlt />, path: "/analyze" },
  { label: "History", icon: <FaHistory />, path: "/history" },
  { label: "Profile", icon: <FaUserCircle />, path: "/user-profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, backendUrl, getUserData } = useContext(AppContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!userData) getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => setIsMobileOpen(false);

  return (
    <>
      
      {!isMobileOpen && (
        <div className="md:hidden fixed top-4 left-4 z-[60]">
          <button
            onClick={toggleSidebar}
            className="text-blue-600 bg-white p-2 rounded-full shadow-md text-2xl "
          >
            <FaBars />
          </button>
        </div>
      )}

      
      <div className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-white shadow-md px-3 py-5 z-40">
        <UserInfo userData={userData} />
        <NavItems
          navItems={navItems}
          pathname={location.pathname}
          onLogout={handleLogout}
        />
      </div>

      
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40"
          onClick={closeSidebar}
        >
          <div
            className="bg-white w-64 h-full p-5 overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 left-4 text-blue-600 text-xl"
              onClick={closeSidebar}
            >
              <FaTimes />
            </button>

            <UserInfo userData={userData} />
            <NavItems
              navItems={navItems}
              pathname={location.pathname}
              onLogout={handleLogout}
              closeSidebar={closeSidebar}
            />
          </div>
        </div>
      )}
    </>
  );
};

const UserInfo = ({ userData }) => (
  <motion.div
    className="text-center mb-6 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl p-3"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {userData?.avatar ? (
      <img
        src={userData.avatar}
        alt="avatar"
        className="w-16 h-16 rounded-full mx-auto object-cover"
      />
    ) : (
      <FaUserCircle size={64} className="text-blue-500 mx-auto" />
    )}
    <h2 className="text-xl font-semibold mt-2">{userData?.fullname}</h2>
    <p className="text-sm text-gray-500">{userData?.email}</p>
  </motion.div>
);

const NavItems = ({ navItems, pathname, onLogout, closeSidebar }) => (
  <nav className="space-y-5">
    {navItems.map((item) => (
      <Link
        key={item.label}
        to={item.path}
        onClick={closeSidebar}
        className={`group flex items-center space-x-3 px-3 py-2 rounded-md transition text-lg font-bold${
          pathname === item.path
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-blue-50 hover:text-blue-500"
        }`}
      >
        <span className="text-blue-600 group-hover:translate-x-1 transition text-xl">
          {item.icon}
        </span>
        <span className="text-gray-700 group-hover:text-blue-600 transition ">
          {item.label}
        </span>
      </Link>
    ))}

    <div className="border-t pt-4 mt-4">
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 
          bg-red-500 text-white cursor-pointer rounded-lg hover:bg-red-600 hover:shadow-md hover:scale-105 transition-all"
      >
        <HiOutlineLogout size={18} />
        <span>Logout</span>
      </button>
    </div>
  </nav>
);

export default Sidebar;
