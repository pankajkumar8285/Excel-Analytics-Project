import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const UserProfile = () => {
  const { userData, backendUrl, getUserData } = useContext(AppContext);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    fullname: "",
    username: "",
    email: "",
  });

  // Load user data
  useEffect(() => {
    if (!userData) {
      getUserData();
    } else {
      setAvatarPreview(userData.avatar);
      setEditData({
        fullname: userData.fullname,
        username: userData.username,
        email: userData.email,
      });
    }
  }, [userData]);

  // Handle input change
  const handleEdit = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsUploading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/upload-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success("Avatar updated successfully");
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/v1/user/editprofile`,
        {
          fullname: editData.fullname,
          username: editData.username,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        getUserData();
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex bg-gradient-to-br from-slate-100 to-slate-200"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <main className="flex-1 md:ml-64 p-4 sm:p-6 w-full">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-8">
            User Profile
          </h2>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <img
                src={
                  avatarPreview ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="w-full h-full object-cover rounded-full border-4 border-indigo-500"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer">
                <FaEdit size={14} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            {Object.entries(editData).map(([key, value], index) => (
              <motion.div
                key={key}
                className="bg-slate-50 rounded-xl px-4 py-3 shadow"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <label className="text-gray-700 capitalize text-sm mb-1 block">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  disabled={!isEditing || key === "email"}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  className={`w-full bg-transparent outline-none border-b border-gray-300 text-gray-800 py-1 ${
                    !isEditing || key === "email"
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center pt-6 gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default UserProfile;
