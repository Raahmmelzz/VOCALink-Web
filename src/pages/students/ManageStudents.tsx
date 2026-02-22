import DashboardCard from "../../components/layout/DashboardCard";

export default function ManageStudents() {
  const dummyStudents = ["Rammel Pacamo", "Marvin Bisakol", "Charlie Kirk", "Thomas Shelby"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* BOX 1: Header and Add Button */}
      <DashboardCard>
        {/* The ugly flex wrapper is GONE. The card handles the spacing. */}
        <div>
          <h2 style={{ color: "#2aa7ff", margin: "0 0 8px 0", fontSize: "24px" }}>
            Manage Students
          </h2>
          <p style={{ color: "#64748b", margin: 0 }}>
            This is your student roster. You can add or edit students here.
          </p>
        </div>
        
        <button 
          style={{ 
            backgroundColor: "#2aa7ff", color: "white", border: "none", 
            padding: "10px 16px", borderRadius: "6px", cursor: "pointer" 
          }}
        >
          + Add New Student
        </button>
      </DashboardCard>

      {/* BOX 2: The Roster */}
      <DashboardCard>
        <h3 style={{ color: "#334155", margin: 0, fontSize: "18px" }}>
          Current Roster
        </h3>
        
        <ul style={{ 
          color: "#0f172a", margin: 0, paddingLeft: "24px", 
          display: "flex", flexDirection: "column", gap: "8px", fontSize: "16px"
        }}>
          {dummyStudents.map((student, index) => (
            <li key={index}>{student}</li>
          ))}
        </ul>
      </DashboardCard>

    </div>
  );
}