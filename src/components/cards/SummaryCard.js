import React from "react";
import "./SummaryCard.css";

export default function SummaryCard({
  title,
  value,
  trend,
  isPositive,
  period,
}) {
  return (
    <div className="summary-card">
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title">{title}</h3>
          <button className="info-icon">ⓘ</button>
        </div>
        <select className="period-dropdown">
          <option>{period || "This Month"}</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="card-content">
        <div className="value-section">
          <div className="main-value">{value}</div>
          <span
            className={`trend-badge ${isPositive ? "positive" : "negative"}`}
          >
            {isPositive ? "↑" : "↓"} {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
