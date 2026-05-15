import React from "react";
import "./DashboardCard.css";

export default function DashboardCard({
  title,
  subtitle,
  value,
  trend,
  isPositive,
  children,
  className = "",
}) {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {trend && (
          <div
            className={`trend-badge ${isPositive ? "positive" : "negative"}`}
          >
            <span className="trend-icon">{isPositive ? "▲" : "▼"}</span>
            {trend}
          </div>
        )}
      </div>
      {value && <div className="card-value">{value}</div>}
      {children && <div className="card-content">{children}</div>}
    </div>
  );
}
