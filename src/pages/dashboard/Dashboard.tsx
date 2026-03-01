import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardFooter from "../../components/layout/DashboardFooter";
import DashboardCard from "../../components/layout/DashboardCard";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import "../../styles/DashboardLayout.css";

// --- Mock Data (replace with real API/context data) ---
const weeklyActivity = [
  { day: "Mon", active: 12 },
  { day: "Tue", active: 18 },
  { day: "Wed", active: 15 },
  { day: "Thu", active: 22 },
  { day: "Fri", active: 19 },
  { day: "Sat", active: 8 },
  { day: "Sun", active: 5 },
];

const monthlyActivity = [
  { month: "Jan", active: 40, sessions: 120 },
  { month: "Feb", active: 52, sessions: 145 },
  { month: "Mar", active: 48, sessions: 130 },
  { month: "Apr", active: 61, sessions: 172 },
  { month: "May", active: 55, sessions: 160 },
  { month: "Jun", active: 67, sessions: 195 },
];

// Top students by app usage
const topStudents = [
  { name: "Maria Santos",   sessions: 34, wordsSpoken: 512, streak: 7  },
  { name: "Juan dela Cruz", sessions: 28, wordsSpoken: 430, streak: 5  },
  { name: "Andrea Reyes",   sessions: 25, wordsSpoken: 388, streak: 4  },
  { name: "Carlo Mendoza",  sessions: 21, wordsSpoken: 310, streak: 3  },
  { name: "Sofia Lim",      sessions: 17, wordsSpoken: 260, streak: 2  },
];

// --- Stat Card ---
function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 10,
        padding: "16px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        borderLeft: `4px solid ${color}`,
        flex: 1,
        minWidth: 140,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 12, color: color, fontWeight: 500 }}>{sub}</div>
      )}
    </div>
  );
}

// --- Custom Tooltip ---
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "10px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontSize: 13,
        }}
      >
        <div style={{ color: "#334155", fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} style={{ color: entry.color, fontWeight: 500 }}>
            {entry.name}: <strong>{entry.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const location = useLocation();

  const isOverview =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

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
            {/* Page Title */}
            <div style={{ marginBottom: 20 }}>
              <h2 className="page-title" style={{ marginBottom: 4 }}>
                Student Activity
              </h2>
              <p className="page-desc">
                Live usage stats from the VocalLink mobile app — track active students, sessions, and spoken words in real time.
              </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
              <StatCard icon="👥" label="Total Students"      value={67}   sub="↑ 4 this month"    color="#2aa7ff" />
              <StatCard icon="📱" label="Active on App Today" value={22}   sub="↑ 3 vs yesterday"  color="#22c55e" />
              <StatCard icon="🗣️" label="Words Spoken Today"  value={1900} sub="Avg 86/student"     color="#f59e0b" />
              <StatCard icon="🔥" label="Avg Daily Streak"    value="4.2d" sub="↑ 0.5 vs last week" color="#2aa7ff" />
            </div>

            {/* Active Students Chart */}
            <DashboardCard>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#2aa7ff" }}>
                    Active Students
                  </h3>
                  <p style={{ margin: "3px 0 0", fontSize: 13, color: "#64748b" }}>
                    {chartView === "weekly"
                      ? "Daily mobile app activity this week"
                      : "Monthly app usage trends"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    background: "#f6f8fb",
                    borderRadius: 8,
                    padding: 3,
                    gap: 3,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {(["weekly", "monthly"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setChartView(v)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13,
                        background: chartView === v ? "#2aa7ff" : "transparent",
                        color: chartView === v ? "#ffffff" : "#64748b",
                        transition: "background-color 0.2s, color 0.2s",
                        textTransform: "capitalize",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: "#e2e8f0", marginBottom: 20 }} />

              {chartView === "weekly" ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={weeklyActivity} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2aa7ff" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2aa7ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="day"   tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis               tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="active"
                      name="Active Students"
                      stroke="#2aa7ff"
                      strokeWidth={2.5}
                      fill="url(#colorActive)"
                      dot={{ fill: "#2aa7ff", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#2aa7ff", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={monthlyActivity} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis               tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: 12 }} />
                    <Bar dataKey="active"   name="Active Students" fill="#2aa7ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sessions" name="Sessions"        fill="#bae0ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </DashboardCard>

            {/* Top Students Table */}
            <DashboardCard>
              <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#2aa7ff" }}>
                Most Active Students
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>
                Ranked by app sessions this month
              </p>
              <div style={{ height: 1, background: "#e2e8f0", marginBottom: 16 }} />

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      {["#", "Student", "Sessions", "Words Spoken", "Streak"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "8px 12px",
                            textAlign: "left",
                            color: "#64748b",
                            fontWeight: 600,
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.map((s, i) => (
                      <tr
                        key={s.name}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          background: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                        }}
                      >
                        <td style={{ padding: "12px 12px", color: "#94a3b8", fontWeight: 700 }}>
                          {i + 1}
                        </td>
                        <td style={{ padding: "12px 12px", color: "#0f172a", fontWeight: 600 }}>
                          {s.name}
                        </td>
                        <td style={{ padding: "12px 12px", color: "#334155" }}>
                          {s.sessions}
                        </td>
                        <td style={{ padding: "12px 12px", color: "#334155" }}>
                          {s.wordsSpoken.toLocaleString()}
                        </td>
                        <td style={{ padding: "12px 12px" }}>
                          <span
                            style={{
                              background: "#eff6ff",
                              color: "#2aa7ff",
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          >
                            🔥 {s.streak} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </>
        ) : (
          <Outlet />
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}