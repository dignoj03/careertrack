function StatCard({ label, value, icon }) {
    return (
      <div className="card stat-card">
        <div className="stat-icon">{icon}</div>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
      </div>
    );
  }
  
  export default StatCard;