import React, { useContext, useState, useEffect } from "react";
import { FaFileAlt, FaUpload, FaChartBar, FaHistory } from "react-icons/fa";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Chart2DRenderer from "../components/Chart2DRenderer";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const Dashboard = () => {
  const { userData, getUserData, backendUrl } = useContext(AppContext);

  const [stats, setStats] = useState("0");
  const [activity, setActivity] = useState({ recentFiles: [], recent: [] });

  const summaryBoxes = [
    { label: "Total Files", data: stats.totalFiles, icon: <FaFileAlt /> },
    { label: "Total Rows", data: "0", icon: <FaChartBar /> },
    { label: "Recent Uploads", data: stats.recentFilesCounts, icon: <FaUpload /> },
  ];

  const historyItems = [
    { label: "Today", data: stats.todayFiles, icon: <FaFileAlt /> },
    { label: "This Week", data: stats.thisWeekFiles, icon: <FaChartBar /> },
    { label: "Large Files", data: stats.largeFileCount, icon: <FaUpload /> },
    { label: "All Files", data: stats.totalFiles, icon: <FaHistory /> },
  ];

  useEffect(() => {
    let isMounted = true;
    axios.defaults.withCredentials = true;
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/file/data`);
        if (isMounted) setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/file/recent`);
        const recentFiles = res.data?.recentFiles || [];
        const recent = res.data?.recent || [];
        setActivity({ recentFiles, recent });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchActivity();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 md:ml-64">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Welcome back, {userData?.fullname}
      </motion.h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {summaryBoxes.map((box, index) => (
          <motion.div
            key={box.label}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md hover:scale-105 transition-all duration-300"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-blue-500 text-2xl">{box.icon}</div>
              <h2 className="text-lg font-semibold">{box.label}</h2>
            </div>
            <p className="text-3xl text-blue-600 mt-2">{box.data}</p>
          </motion.div>
        ))}
      </div>

      {/* History Overview */}
      <motion.div
        className="bg-white p-5 rounded-xl shadow mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={4}
      >
        <h2 className="text-xl font-bold mb-4">History Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {historyItems.map((item, index) => (
            <div
              key={item.label}
              className="bg-slate-50 p-4 rounded-lg text-center hover:bg-blue-50 transition"
            >
              <div className="flex justify-center mb-2 text-blue-500 text-xl">
                {item.icon}
              </div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-blue-600">{item.data}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div
        className="bg-white p-5 rounded-xl shadow mb-12"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={5}
      >
        <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>
        <div className="text-center overflow-x-auto">
          {activity.recent.length > 0 ? (
            <div className="min-w-[300px]">
              <Chart2DRenderer
                chartType="Bar Chart (2D)"
                data={activity.recent}
                xAxis="filename"
                yAxis="totalRows"
                color="#3b82f6"
                size={600}
              />
            </div>
          ) : (
            <p className="text-center text-gray-400">No data to display</p>
          )}
        </div>
      </motion.div>

      {/* Recent Files */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={6}
      >
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Recent Files
        </h2>
        {activity.recentFiles.length === 0 ? (
          <div className="flex flex-col items-center text-gray-500 py-10">
            <img
              src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
              alt="No files"
              className="w-12 h-12 mb-2 opacity-70"
            />
            <h3 className="text-md font-semibold">No Recent Uploads</h3>
            <p className="text-sm">Start by uploading your first file!</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto rounded-md border border-gray-200">
            <ul className="list-decimal list-outside pl-6 pr-4 py-2 space-y-4">
              {activity.recentFiles.map((file, index) => (
                <li key={file._id} className="text-left flex gap-3">
                  <span className="font-semibold text-blue-500">{index + 1}.</span>
                  <div>
                    <p className="font-medium text-blue-700">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(file.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={7}
      >
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Recent Activity
        </h2>
        {activity.recent.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-center text-gray-500">
            <div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                alt="activity"
                className="w-10 h-10 mx-auto opacity-70 mb-2"
              />
              <p className="text-sm">No recent activity</p>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto rounded-md border border-gray-200">
            <ul className="list-decimal list-outside pl-6 pr-4 py-2 space-y-4">
              {activity.recent.map((file, index) => (
                <li key={file._id} className="text-left flex gap-3">
                  <span className="font-semibold text-blue-500">{index + 1}.</span>
                  <div>
                    <p className="font-medium text-blue-700">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(file.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </main>
  );
};

export { Dashboard };
