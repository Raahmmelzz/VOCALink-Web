import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useActivityChart } from "../../hooks/useActivityChart";
import DashboardCard from "../layout/DashboardCard";

// Custom Tooltip stays as a helper component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 13 }}>
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

export default function ActivityChart({ weeklyData, monthlyData }: { weeklyData: any[], monthlyData: any[] }) {
  const { chartView, setChartView, isWeekly, title, description } = useActivityChart();

  return (
    <DashboardCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#2aa7ff" }}>{title}</h3>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#64748b" }}>{description}</p>
        </div>

        <div style={{ display: "flex", background: "#f6f8fb", borderRadius: 8, padding: 3, gap: 3, border: "1px solid #e2e8f0" }}>
          {(["weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setChartView(v)}
              style={{
                padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
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

      <ResponsiveContainer width="100%" height={240}>
        {isWeekly ? (
          <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2aa7ff" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2aa7ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
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
        ) : (
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: 12 }} />
            <Bar dataKey="active" name="Active Students" fill="#2aa7ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sessions" name="Sessions" fill="#bae0ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </DashboardCard>
  );
}