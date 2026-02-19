// Notice we are accepting the onOpenMenu prop here
export default function DashboardHeader({ onOpenMenu }: { onOpenMenu?: () => void }) {
  return (
    <header style={{ 
      background: "#fff", 
      padding: "16px 24px", 
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      gap: "16px"
    }}>
      
      {/* The Burger Button! */}
      {onOpenMenu && (
        <button 
          onClick={onOpenMenu}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "4px"
          }}
          aria-label="Open Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Your existing header stuff (Logo, title, etc) goes here */}
      <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#213547" }}>VocaLink</h2>

    </header>
  );
}