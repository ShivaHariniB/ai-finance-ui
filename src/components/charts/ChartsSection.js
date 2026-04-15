import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  mockLineChartData,
  mockCashFlowData,
  mockSpendingBreakdown,
} from "../../utils/mockData.js";
import "./ChartsSection.css";

export default function ChartsSection() {
  return (
    <div className="charts-section">
      {/* Cash Flow Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            Cash Flow <span className="info-icon">ⓘ</span>
          </h3>
          <select className="period-dropdown">
            <option>Yearly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCashFlowData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="value"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
              >
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#DBEAFE" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">August 2025:</span>
            <span className="stat-value">$8,689.20</span>
          </div>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="chart-card">
        <h3 className="chart-title">Spending Breakdown</h3>
        <div className="spending-breakdown">
          {mockSpendingBreakdown.map((item, index) => (
            <div key={index} className="spending-item">
              <div className="spending-label">{item.label}</div>
              <div className="spending-bar-wrapper">
                <div
                  className="spending-bar"
                  style={{
                    width: `${(item.value / 2000) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="spending-value">
                ${item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
