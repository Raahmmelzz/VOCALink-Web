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
import "../../styles/DashboardComponent.css";

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

const topStudents = [
  { name: "Maria Santos",   sessions: 34, wordsSpoken: 512, streak: 7 },
  { name: "Juan dela Cruz", sessions: 28, wordsSpoken: 430, streak: 5 },
  { name: "Andrea Reyes",   sessions: 25, wordsSpoken: 388, streak: 4 },
  { name: "Carlo Mendoza",  sessions: 21, wordsSpoken: 310, streak: 3 },
  { name: "Sofia Lim",      sessions: 17, wordsSpoken: 260, streak: 2 },
];

// Stat Card reuses DashboardCard as its container — no duplicate bg/shadow/radius styles
function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accentColor: string;
}) {
  return (
    <DashboardCard style={{ borderLeft: `4px solid ${accentColor}`, flex: 1, minWidth: 140, gap: 6 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span className="user-email" style={{ fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{value}</span>
      {sub && (
        <span style={{ fontSize: 12, color: accentColor, fontWeight: 500 }}>{sub}</span>
      )}
    </DashboardCard>
  );
}

// Custom tooltip uses CSS variables so it stays consistent with the theme
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: "10px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontSize: 13,
        }}
      >
        <div style={{ color: "var(--text-dark)", fontWeight: 600, marginBottom: 6 }}>{label}</div>
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
            {/* Page Heading */}
            <div style={{ marginBottom: 20 }}>
              <h2 className="page-title">Student Activity</h2>
              <p className="page-desc">
                Live usage stats from the VocalLink mobile app  track active students, sessions, and spoken words in real time.
              </p>
            </div>

            {/* Stat Cards — each is a DashboardCard with an accent border */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
              <StatCard icon="👥" label="Total Students"      value={67}   sub="↑ 4 this month"     accentColor="#2aa7ff" />
              <StatCard icon="📱" label="Active on App Today" value={22}   sub="↑ 3 vs yesterday"   accentColor="#22c55e" />
              <StatCard icon="🗣️" label="Words Spoken Today"  value={1900} sub="Avg 86 / student"   accentColor="#f59e0b" />
              <StatCard icon="🔥" label="Avg Daily Streak"    value="4.2d" sub="↑ 0.5 vs last week" accentColor="#2aa7ff" />
            </div>

            {/* Active Students Chart */}
            <DashboardCard>
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <h3 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>
                    Active Students
                  </h3>
                  <p className="page-desc" style={{ fontSize: 13, margin: 0 }}>
                    {chartView === "weekly"
                      ? "Daily mobile app activity this week"
                      : "Monthly app usage trends"}
                  </p>
                </div>

                {/* Toggle reuses .save-btn and .secondary-btn from DashboardComponent.css */}
                <div
                  style={{
                    display: "flex",
                    background: "#f6f8fb",
                    borderRadius: 8,
                    padding: 3,
                    gap: 3,
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {(["weekly", "monthly"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setChartView(v)}
                      className={chartView === v ? "save-btn" : "secondary-btn"}
                      style={{ padding: "6px 16px", fontSize: 13, textTransform: "capitalize", borderRadius: 6 }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider reuses .divider class */}
              <hr className="divider" style={{ margin: "4px 0 8px" }} />

              {chartView === "weekly" ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={weeklyActivity} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2aa7ff" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2aa7ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="day"  tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <YAxis              tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <YAxis               tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-muted)", paddingTop: 12 }} />
                    <Bar dataKey="active"   name="Active Students" fill="#2aa7ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sessions" name="Sessions"        fill="#bae0ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </DashboardCard>

            {/* Most Active Students Table */}
            <DashboardCard>
              <div style={{ width: "100%" }}>
                <h3 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>
                  Most Active Students
                </h3>
                <p className="page-desc" style={{ fontSize: 13, margin: "0 0 4px" }}>
                  Ranked by app sessions this month
                </p>

                <hr className="divider" />

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                        {["#", "Student", "Sessions", "Words Spoken", "Streak"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "8px 12px",
                              textAlign: "left",
                              color: "var(--text-muted)",
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
                            borderBottom: "1px solid var(--border-color)",
                            background: i % 2 === 0 ? "var(--white)" : "#f8fafc",
                          }}
                        >
                          <td style={{ padding: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                            {i + 1}
                          </td>
                          {/* Reuses .student-name class */}
                          <td style={{ padding: "12px" }}>
                            <span className="student-name">{s.name}</span>
                          </td>
                          <td style={{ padding: "12px", color: "var(--text-dark)" }}>
                            {s.sessions}
                          </td>
                          <td style={{ padding: "12px", color: "var(--text-dark)" }}>
                            {s.wordsSpoken.toLocaleString()}
                          </td>
                          {/* Reuses .badge class */}
                          <td style={{ padding: "12px" }}>
                            <span className="badge" style={{ color: "#2aa7ff", background: "#eff6ff" }}>
                              🔥 {s.streak} days
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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