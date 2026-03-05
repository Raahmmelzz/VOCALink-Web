import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardFooter from "../../components/layout/DashboardFooter";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

// Extracted Components
import StatCard from "../../components/layout/StatCard";
import ActivityChart from "../../components/layout/ActivityChart";
import TopStudentsTable from "../../components/layout/TopStudentsTable";

// Import your newly extracted mock data
import { weeklyActivity, monthlyActivity, topStudents } from "../../data/mockData";

import "../../styles/DashboardLayout.css";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div className="dashboard-layout">
      <DashboardHeader onOpenMenu={() => setIsSidebarOpen(true)} />

      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={`dashboard-main ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {isOverview ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 className="page-title" style={{ marginBottom: 4 }}>Student Activity</h2>
              <p className="page-desc">
                Live usage stats from the VocalLink mobile app — track active students, sessions, and spoken words in real time.
              </p>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
              <StatCard icon="👥" label="Total Students" value={67} sub="↑ 4 this month" color="#2aa7ff" />
              <StatCard icon="📱" label="Active on App Today" value={22} sub="↑ 3 vs yesterday" color="#22c55e" />
              <StatCard icon="🗣️" label="Words Spoken Today" value={1900} sub="Avg 86/student" color="#f59e0b" />
              <StatCard icon="🔥" label="Avg Daily Streak" value="4.2d" sub="↑ 0.5 vs last week" color="#2aa7ff" />
            </div>

            <ActivityChart weeklyData={weeklyActivity} monthlyData={monthlyActivity} />
            <TopStudentsTable students={topStudents} />
          </>
        ) : (
          <Outlet />
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}