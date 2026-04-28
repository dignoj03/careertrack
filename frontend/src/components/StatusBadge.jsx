function StatusBadge({ status }) {
    const className = status
      ? status.toLowerCase().replaceAll(" ", "-")
      : "saved";
  
    return <span className={`status-badge status-${className}`}>{status}</span>;
  }
  
  export default StatusBadge;