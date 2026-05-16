import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import BottomNavBar from '@/components/shared/BottomNavBar';
import DashboardProfile from '@/components/shared/DashboardProfile';
import DashboardPosts from '@/components/shared/DashboardPosts';
import DashboardUsers from '@/components/shared/DashboardUsers';
import DashboardComments from '@/components/shared/DashboardComments';
import MainDashboard from '@/components/shared/MainDashboard';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab("dashboard"); // Default fallback
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-slate-50">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block border-r border-slate-200">
        <DashboardSidebar />
      </div>

      {/* Navigation - Mobile Only */}
      <BottomNavBar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {tab === "profile" && <DashboardProfile />}
          {tab === "posts" && <DashboardPosts />}
          {tab === "users" && <DashboardUsers />}
          {tab === "comments" && <DashboardComments />}
          {(tab === "dashboard" || !tab) && <MainDashboard />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;