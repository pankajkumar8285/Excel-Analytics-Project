import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaPlay } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <section
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-20 px-6 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          Ready to Transform Your Data?
        </h2>
        <p className="text-lg mb-10 text-white/90">
          Join thousands of professionals who trust <span className="font-semibold">InsightGrid</span> for their analytics needs.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/login')} className="relative overflow-hidden bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            Start Free Trial
            <span className="absolute left-[-60%] top-0 h-full w-[200%] -skew-x-12 bg-white opacity-10 transition-all duration-[1500ms] group-hover:left-[100%] pointer-events-none" />
          </button>

          <button className="relative overflow-hidden border border-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <FaPlay className="text-white text-sm" />
            <span>Watch Demo</span>
            <span className="absolute left-[-60%] top-0 h-full w-[200%] -skew-x-12 bg-white opacity-10 transition-all duration-[1500ms] group-hover:left-[100%] pointer-events-none" />
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-gray-400 text-center py-6 px-4">
        <div className="flex justify-center items-center gap-2 mb-2">
          <img src="/dropbox.png" alt="Logo" className="w-6 h-6" />
          <span className="font-semibold bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">InsightGrid</span>
        </div>
        <p className="text-sm mb-2">© 2025 InsightGrid. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms & Conditions</a>
          <a href="#" className="hover:text-white transition">Contact Support</a>
        </div>
      </footer>
    </>
  );
};
