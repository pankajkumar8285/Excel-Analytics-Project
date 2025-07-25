import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

     
      <main className="flex-1 pt-20 md:pt-8 px-4 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
