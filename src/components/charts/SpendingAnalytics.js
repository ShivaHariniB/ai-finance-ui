import React, { useState, useMemo } from "react";
import "./SpendingAnalytics.css";

const MONTH_OPTIONS = [
  "This Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
];

const CATEGORY_COLORS = {
  Food: "#93c5fd",
  Transport: "#4ECDC4",
  Entertainment: "#FFE66D",
  Shopping: "#FF9999",
  Utilities: "#95E1D3",
  Healthcare: "#F8B500",
  Education: "#6C5CE7",
  "House Rent": "#2563eb",
  Subscription: "#c4b5fd",
  Other: "#d1d5db",
};

const CATEGORY_KEYWORDS = {
  Food: ["food", "restaurant", "grocery", "groceries"],
  "House Rent": ["rent", "housing"],
  Transport: ["transport", "taxi", "uber"],
  Entertainment: ["entertainment", "movie", "game"],
  Shopping: ["shopping", "mall", "store"],
  Subscription: ["subscription", "netflix", "spotify"],
};

export default function SpendingAnalytics({ transactions = [] }) {
  const [selectedMonth, setSelectedMonth] = useState("This Month");

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount.toFixed(2)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Helper function to filter transactions by month
  const filterTransactionsByMonth = (transactionsToFilter, month) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactionsToFilter.filter((transaction) => {
      if (!transaction.date) return false;

      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      if (month === "This Month") {
        return (
          transactionYear === currentYear && transactionMonth === currentMonth
        );
      } else if (month === "Last Month") {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear =
          currentMonth === 0 ? currentYear - 1 : currentYear;
        return (
          transactionYear === lastMonthYear && transactionMonth === lastMonth
        );
      } else if (month === "Last 3 Months") {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return transactionDate >= threeMonthsAgo;
      } else if (month === "Last 6 Months") {
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return transactionDate >= sixMonthsAgo;
      }
      return true;
    });
  };

  // Helper function to infer category from transaction name
  const inferCategory = (name) => {
    if (!name) return "Other";
    const nameLower = name.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((keyword) => nameLower.includes(keyword))) {
        return category;
      }
    }
    return "Other";
  };

  // Calculate total spending and group by category
  const spendingData = useMemo(() => {
    const filteredTransactions = filterTransactionsByMonth(
      transactions,
      selectedMonth,
    );
    const categoryMap = {};

    // Process transactions: group by category and sum amounts
    filteredTransactions.forEach((transaction) => {
      // Only process expense transactions (negative amounts)
      if (transaction.amount < 0) {
        let category = transaction.category || inferCategory(transaction.name);
        const amount = Math.abs(transaction.amount);

        if (categoryMap[category]) {
          categoryMap[category] += amount;
        } else {
          categoryMap[category] = amount;
        }
      }
    });

    const data = Object.entries(categoryMap)
      .map(([category, value]) => ({
        name: category,
        value: Math.round(value * 100) / 100,
        color: CATEGORY_COLORS[category] || "#d1d5db",
      }))
      .sort((a, b) => b.value - a.value); // Sort by amount descending

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return { data, total };
  }, [transactions, selectedMonth]);

  // Reusable header component
  const headerJSX = (
    <div className="spending-header">
      <div className="title-section">
        <h3 className="spending-title">Spending Overview</h3>
        <i className="bi bi-info-circle info-icon"></i>
      </div>
      <select
        className="month-dropdown"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {MONTH_OPTIONS.map((month) => (
          <option key={month}>{month}</option>
        ))}
      </select>
    </div>
  );

  // Handle empty state
  if (spendingData.data.length === 0) {
    return (
      <>
        {headerJSX}
        <div className="spending-analytics-empty">
          <p>No expense data available</p>
        </div>
      </>
    );
  }

  const totalSpending = spendingData.total;
  const chartData = spendingData.data;

  return (
    <>
      {headerJSX}

      {/* Value and Trend */}
      <div className="spending-value-section">
        <div className="value-display">
          <h2 className="spending-value">${formatCurrency(totalSpending)}</h2>
          <span className="spending-trend negative">+1.5% ▼</span>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="breakdown-section">
        <h4 className="breakdown-title">Spending Breakdown</h4>

        {/* Legend */}
        <div className="legend">
          {chartData.map((item, index) => (
            <div key={index} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="legend-info">
                <p className="legend-label">{item.name}</p>
                <p className="legend-amount">${formatCurrency(item.value)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Bar Chart */}
        <div className="horizontal-bar-chart">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="bar-segment"
              style={{
                width: `${(item.value / totalSpending) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.name}: ${((item.value / totalSpending) * 100).toFixed(1)}%`}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
}
