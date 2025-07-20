import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const About = () => {

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100 px-6 text-center">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">
        Why Choose{" "}
        <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">
          InsightGrid?
        </span>
        
      </h2>
      <p className="text-gray-600 mb-10 text-lg">
        Your next-gen data analytics platform built for scale, speed, and
        security.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
            className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transform transition-all duration-500 hover:scale-105 group overflow-hidden"
          >
            {/* Shine reflection effect */}
          <div className="absolute left-[-50%] top-0 h-full w-[200%] -skew-x-12 bg-white opacity-10 transition-all duration-700 group-hover:left-[100%] pointer-events-none"></div>


            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-500 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const features = [
  {
    title: "Blazing Speed",
    description:
      "Experience Excel processing up to 10x faster with our turbocharged backend engine.",
    icon: "🚀",
  },
  {
    title: "Military-Grade Security",
    description:
      "End-to-end encryption and compliance with SOC2 & ISO27001 standards.",
    icon: "🔐",
  },
  {
    title: "Smart AI Analysis",
    description:
      "Reveal trends and patterns using intelligent machine learning models.",
    icon: "🤖",
  },
  {
    title: "Interactive Dashboards",
    description: "Explore rich data visualizations built for decision-making.",
    icon: "📊",
  },
  {
    title: "Global Collaboration",
    description:
      "Collaborate seamlessly across regions and platforms, anytime.",
    icon: "🌍",
  },
  {
    title: "Real-time Updates",
    description: "Stay in sync across all your devices with zero delay.",
    icon: "⚡",
  },
];
