import React, { useMemo } from "react";
import DashboardCard from "./DashboardCard";
import { generateInsights } from "../../utils/generateInsights";
import "./AIFinancialInsights.css";

export default function AIFinancialInsights({ transactions = [] }) {
  // Generate insights from transactions
  const insights = useMemo(() => {
    return generateInsights(transactions);
  }, [transactions]);

  return (
    <DashboardCard
      title="AI Financial Insights"
      subtitle="Smart analysis"
      className="ai-financial-insights-card"
    >
      <div className="insights-container">
        {insights.length === 0 ? (
          <div className="insights-empty">
            <p>Upload transaction data to see AI-powered insights</p>
          </div>
        ) : (
          <div className="insights-list">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`insight-item insight-${insight.type}`}
              >
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <p className="insight-title">{insight.title}</p>
                  <p className="insight-message">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
