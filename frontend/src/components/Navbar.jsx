import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex flex-row  justify-between items-center p-4 sm:mt-4 sm:p-6 sm:px-24 bg-transparent z-10">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 ">
        <img src="/dropbox.png" alt="Logo" className="w-10 sm:w-12" />
        <span className="font-bold text-2xl font-serif bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">
          InsightGrid
        </span> 
      </div>

      {/* Button */}
      <button
        onClick={() => navigate("/login")}
        className="relative overflow-hidden px-4 cursor-pointer py-2 font-semibold text-black bg-gray-200 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-400 hover:scale-105 group flex items-center gap-2"
      >
        Login
        <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />

        {/* Reflection */}
        <span className="pointer-events-none absolute left-[-75%] top-0 h-full w-[200%] transform -skew-x-12 bg-white opacity-20 transition-all duration-500 group-hover:left-[100%]"></span>
      </button>
    </nav>
  );
};
