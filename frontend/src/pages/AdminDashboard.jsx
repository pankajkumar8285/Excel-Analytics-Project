import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaTrashAlt,
  FaUsers,
  FaEdit,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { backendUrl, adminData, getAdminData } = useContext(AppContext);

  useEffect(() => {
    if (!adminData) {
      getAdminData();
    } else {
      setAvatarPreview(adminData.avatar);
    }
    fetchData();
  }, [adminData]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRes = await axios.get(`${backendUrl}/api/v1/data/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fileRes = await axios.get(`${backendUrl}/api/v1/data/all-files`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUsers = userRes?.data?.users || [];
      setUsers(fetchedUsers);
      setTotalUsers(fetchedUsers.length);
      setTotalFiles(fileRes?.data?.total || 0);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsUploading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/v1/admin/upload-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success("Avatar updated");
        getAdminData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/v1/data/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const chartData = {
    labels: ["Users", "Files"],
    datasets: [
      {
        label: "Count",
        data: [totalUsers, totalFiles],
        backgroundColor: ["#60a5fa", "#34d399"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "System Overview" },
      tooltip: { animation: true },
    },
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-white shadow-md w-full md:w-64 flex flex-col items-center p-6 gap-4">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 group">
          <img
            src={
              avatarPreview ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            className="w-full h-full object-cover rounded-full border-4 border-indigo-500 transition-transform duration-300 group-hover:scale-105"
          />
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors duration-300">
            <FaEdit size={14} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        <h2 className="text-lg font-bold text-center text-gray-800">
          {adminData?.fullName || "Admin"}
        </h2>
        <p className="text-sm text-center text-gray-600">
          {adminData?.email || "admin@example.com"}
        </p>

        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 relative">
        {loading ? (
          <p className="text-center text-lg font-medium">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center text-lg font-medium">
            {error}
          </p>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-center mb-8"
            >
              Admin Dashboard
            </motion.h1>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-lg rounded-xl p-6 flex items-center justify-between transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <h2 className="text-xl font-semibold">Total Users</h2>
                  <p className="text-3xl text-blue-500 font-bold">
                    {totalUsers}
                  </p>
                </div>
                <FaUsers className="text-blue-400 text-4xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white shadow-lg rounded-xl p-6 flex items-center justify-between transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <h2 className="text-xl font-semibold">Total Files</h2>
                  <p className="text-3xl text-green-500 font-bold">
                    {totalFiles}
                  </p>
                </div>
                <FaFileAlt className="text-green-400 text-4xl" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="bg-white shadow-xl rounded-xl p-4 mb-10 h-72"
            >
              <Bar data={chartData} options={chartOptions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-white shadow-xl rounded-xl p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">User List</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-100 transition-colors duration-200"
                      >
                        <td className="p-2">{user.fullname}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                          >
                            <FaTrashAlt /> Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};
