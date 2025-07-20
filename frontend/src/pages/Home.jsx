import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { About } from "./About";
import { Services } from "./Services";
import { Footer } from "./Footer";

export const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const navigate = useNavigate();

  return (
    <div >
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-purple-100 text-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" data-aos="fade-up">
            Welcome to <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">InsightGrid</span>
            <span className="text-orange-400"></span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Empower your data journey — from Excel to insight in seconds with{" "}
            <span className="text-blue-600 font-semibold">
              Premium Analytics Platform
            </span>
          </p>

          <div
            className="flex flex-wrap gap-4 justify-center mb-10"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-full text-sm md:text-base font-semibold hover:bg-blue-700 transition transform hover:scale-105">
                Get Started Free
              </button>
            </Link>

            <button className="flex items-center gap-2 cursor-pointer border px-6 py-3 rounded-full hover:bg-gray-100 transition transform hover:scale-105">
              <FaPlay className="text-gray-600" />
              Watch Demo
            </button>
          </div>

          {/* Stat Boxes */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <StatBox label="Active Users" value="10K+" />
            <StatBox label="Teams Onboarded" value="500+" />
            <StatBox label="Files Processed" value="1M+" />
            <StatBox label="Uptime" value="99.9%" />
          </div>
        </div>
      </section>

      <About />
      <Services />
      <Footer />
    </div>
  );
};

// Reusable stat box
function StatBox({ label, value }) {
  return (
    <div className="group bg-white px-6 py-8 rounded-xl shadow text-center w-full transform transition duration-500 hover:scale-105 hover:shadow-xl relative overflow-hidden">
      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500">{label}</p>

      {/* Reflection effect on hover */}
      <div className="absolute left-[-50%] top-0 h-full w-[200%] -skew-x-12 bg-white opacity-10 transition-all duration-700 group-hover:left-[100%] pointer-events-none"></div>
    </div>
  );
}
