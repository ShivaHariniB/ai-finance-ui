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
  Health: "#f87171",
  Education: "#6C5CE7",
  "House Rent": "#2563eb",
  Subscription: "#c4b5fd",
  Travel: "#8B5CF6",
  Groceries: "#34d399",
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

  // Helper to check if transaction is an expense
  const isExpense = (transaction) => transaction.amount < 0;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount.toFixed(2)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Helper to calculate total expenses from transactions
  const calculateExpenseTotal = (txns) => {
    return txns.filter(isExpense).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  // Helper to get previous month and year
  const getPreviousMonth = (month, year) => ({
    month: month === 0 ? 11 : month - 1,
    year: month === 0 ? year - 1 : year,
  });

  // Helper to get date offset
  const getDateOffset = (monthsBack) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBack);
    return date;
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
        const { month: lastMonth, year: lastMonthYear } = getPreviousMonth(
          currentMonth,
          currentYear,
        );
        return (
          transactionYear === lastMonthYear && transactionMonth === lastMonth
        );
      } else if (month === "Last 3 Months") {
        return transactionDate >= getDateOffset(3);
      } else if (month === "Last 6 Months") {
        return transactionDate >= getDateOffset(6);
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

  // Helper function to calculate percentage of total
  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  // Helper to get transactions from previous equivalent period
  const getPreviousPeriodTransactions = (periodName) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (periodName === "This Month") {
      const { month: lastMonth, year: lastMonthYear } = getPreviousMonth(
        currentMonth,
        currentYear,
      );
      return transactions.filter(
        (t) =>
          t.date &&
          new Date(t.date).getMonth() === lastMonth &&
          new Date(t.date).getFullYear() === lastMonthYear,
      );
    } else if (periodName === "Last Month") {
      const { month: lastMonth, year: lastMonthYear } = getPreviousMonth(
        currentMonth,
        currentYear,
      );
      const { month: monthBefore, year: monthBeforeYear } = getPreviousMonth(
        lastMonth,
        lastMonthYear,
      );
      return transactions.filter(
        (t) =>
          t.date &&
          new Date(t.date).getMonth() === monthBefore &&
          new Date(t.date).getFullYear() === monthBeforeYear,
      );
    } else if (periodName === "Last 3 Months") {
      const sixMonthsAgo = getDateOffset(6);
      const threeMonthsAgo = getDateOffset(3);
      return transactions.filter(
        (t) =>
          t.date &&
          new Date(t.date) >= sixMonthsAgo &&
          new Date(t.date) < threeMonthsAgo,
      );
    } else if (periodName === "Last 6 Months") {
      const twelveMonthsAgo = getDateOffset(12);
      const sixMonthsAgo = getDateOffset(6);
      return transactions.filter(
        (t) =>
          t.date &&
          new Date(t.date) >= twelveMonthsAgo &&
          new Date(t.date) < sixMonthsAgo,
      );
    }
    return [];
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
      if (isExpense(transaction)) {
        const category =
          transaction.category || inferCategory(transaction.name);
        const amount = Math.abs(transaction.amount);
        categoryMap[category] = (categoryMap[category] || 0) + amount;
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

  // Calculate trend by comparing with previous equivalent period
  const trendData = useMemo(() => {
    const currentTotal = spendingData.total;
    const previousTotal = calculateExpenseTotal(
      getPreviousPeriodTransactions(selectedMonth),
    );

    // If no previous period data, show no trend
    if (previousTotal === 0) {
      return { trend: 0, trendPositive: true, showTrend: false };
    }

    const percentChange = (
      ((currentTotal - previousTotal) / previousTotal) *
      100
    ).toFixed(1);
    const spending_increased = currentTotal > previousTotal;

    return {
      trend: Math.abs(percentChange),
      trendPositive: !spending_increased, // Decreased spending is good (positive/green)
      increased: spending_increased,
      showTrend: true,
    };
  }, [selectedMonth, spendingData]);

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

  // Render trend badge
  const renderTrendBadge = () => (
    trendData.showTrend && (
      <span
        className={`spending-trend ${
          trendData.trendPositive ? "positive" : "negative"
        }`}
      >
        {trendData.increased ? "+" : "-"}
        {trendData.trend}% {trendData.increased ? "↑" : "↓"}
      </span>
    )
  );

  // Render legend item
  const renderLegendItem = (item, index) => (
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
  );

  // Render bar segment
  const renderBarSegment = (item, index) => {
    const percentage = calculatePercentage(item.value, totalSpending);
    return (
      <div
        key={index}
        className="bar-segment"
        style={{
          width: `${percentage}%`,
          backgroundColor: item.color,
        }}
        title={`${item.name}: ${percentage}%`}
      ></div>
    );
  };

  return (
    <>
      {headerJSX}

      {/* Value and Trend */}
      <div className="spending-value-section">
        <div className="value-display">
          <h2 className="spending-value">${formatCurrency(totalSpending)}</h2>
          {renderTrendBadge()}
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="breakdown-section">
        <h4 className="breakdown-title">Spending Breakdown</h4>

        {/* Legend */}
        <div className="legend">
          {chartData.map((item, index) => renderLegendItem(item, index))}
        </div>

        {/* Horizontal Bar Chart */}
        <div className="horizontal-bar-chart">
          {chartData.map((item, index) => renderBarSegment(item, index))}
        </div>
      </div>
    </>
  );
}
