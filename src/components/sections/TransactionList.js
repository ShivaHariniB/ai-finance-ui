import React, { useState } from "react";
import "./TransactionList.css";

export default function TransactionList({ transactions = [] }) {
  const [filterOpen, setFilterOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
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
    <div className="transaction-list-card">
      <div className="transaction-header">
        <h3 className="transaction-title">Recent Transaction</h3>
        <button
          className="filter-btn"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          ⚙️ Filter
        </button>
      </div>

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
                  <td className="date-cell">{formatDate(transaction.date)}</td>
                  <td className="amount-cell">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="status-cell">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          getStatusColor(transaction.status) + "20",
                        color: getStatusColor(transaction.status),
                      }}
                    >
                      ● {transaction.status || "Completed"}
                    </span>
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
  );
}
