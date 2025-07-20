import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    name: "Akshat Rastogi",
    role: "Data Scientist, TechCorp",
    initials: "AR",
    color: "bg-purple-500",
    quote:
      "InsightGrid streamlined our entire workflow. Its intelligent insights save us significant time and elevate the quality of our decisions.",
  },
  {
    name: "Aditya Pragapati",
    role: "Business Analyst, FinanceCo",
    initials: "AP",
    color: "bg-pink-500",
    quote:
      "File uploads are seamless, and the analytics engine delivers deep insights instantly—like having a data science team on demand.",
  },
  {
    name: "Ankit Kumar",
    role: "Operations Manager, StartupXYZ",
    initials: "AK",
    color: "bg-sky-500",
    quote:
      "InsightGrid’s user-friendly design and powerful AI insights enabled us to make smarter decisions and increase efficiency by 40%.",
  },
];

export const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-blue-50 py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">
          Trusted by <span className="bg-gradient-to-r from-blue-500 to-orange-400 text-transparent bg-clip-text">Professionals</span>
        </h2>
        <p className="text-gray-600 mt-2">See what industry leaders are saying about InsightGrid</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
            className="group bg-white p-6 rounded-xl w-full sm:w-80 shadow transition-all duration-500 hover:scale-105 hover:shadow-xl relative overflow-hidden"
          >
            {/* Reflection effect */}
            <div className="absolute left-[-50%] top-0 h-full w-[200%] -skew-x-12 bg-white opacity-10 transition-all duration-700 group-hover:left-[100%] pointer-events-none" />

            <div className="flex items-center gap-4 mb-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${item.color}`}>
                {item.initials}
              </div>
              <div className="text-left">
                <h3 className="text-gray-800 font-bold text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">"{item.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};
