import DashboardCard from "../layout/DashboardCard";

interface StudentData {
  name: string;
  sessions: number;
  wordsSpoken: number;
  streak: number;
}

export default function TopStudentsTable({ students }: { students: StudentData[] }) {
  return (
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
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.name} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                <td style={{ padding: "12px 12px", color: "#94a3b8", fontWeight: 700 }}>{i + 1}</td>
                <td style={{ padding: "12px 12px", color: "#0f172a", fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: "12px 12px", color: "#334155" }}>{s.sessions}</td>
                <td style={{ padding: "12px 12px", color: "#334155" }}>{s.wordsSpoken.toLocaleString()}</td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ background: "#eff6ff", color: "#2aa7ff", padding: "3px 10px", borderRadius: 20, fontWeight: 600, fontSize: 12 }}>
                    🔥 {s.streak} days
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}