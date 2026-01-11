import React from "react";
import axios from "axios";

export const Logout = () => {
  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return <div></div>;
};
