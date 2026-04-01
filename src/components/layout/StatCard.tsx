
// Make sure this path points correctly to where your CSS file lives!
import "../../styles/DashboardComponent.css"; 

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: string;
}

export default function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  return (
    <div 
      className="stat-card" 
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && (
        <div className="stat-card-sub" style={{ color: color }}>
          {sub}
        </div>
      )}
    </div>
  );
}