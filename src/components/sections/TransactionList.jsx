import React, { useState } from "react";
import DashboardCard from "../cards/DashboardCard";
import "./TransactionList.css";

export default function TransactionList({ transactions = [] }) {
  const [filterOpen, setFilterOpen] = useState(false);

  // Get transaction type (Debit/Credit) based on amount
  const getTransactionType = (amount) => {
    if (typeof amount === "number") {
      return amount < 0
        ? { type: "Debit", color: "#ef4444" }
        : { type: "Credit", color: "#10b981" };
    }
    return { type: "Transfer", color: "#6b7280" };
  };

  // Format amount for display
  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return amount < 0
        ? `-$${Math.abs(amount).toFixed(2)}`
        : `+$${amount.toFixed(2)}`;
    }
    return amount;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // If it's already formatted, return as is
    if (dateStr.includes(":")) return dateStr;
    // Try to parse and format
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    return dateStr;
  };

  return (
    <DashboardCard
      title="Recent Transactions"
      className="transaction-list-card"
    >
      <div className="transaction-content">
        <button
          className="filter-btn"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          ⚙️ Filter
        </button>

        {transactions.length > 0 ? (
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="transaction-row">
                    <td className="activity-cell">
                      <span className="transaction-icon">
                        {transaction.icon || "💳"}
                      </span>
                      <span className="transaction-name">
                        {transaction.name ||
                          transaction.category ||
                          "Transaction"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="amount-cell">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="status-cell">
                      {(() => {
                        const txType = getTransactionType(transaction.amount);
                        return (
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: txType.color + "20",
                              color: txType.color,
                            }}
                          >
                            ● {txType.type}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="action-cell">
                      <button className="row-menu-btn">⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No transactions yet. Upload a CSV to get started!</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
