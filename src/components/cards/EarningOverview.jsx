import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./EarningOverview.css";

const MONTH_OPTIONS = [
  "This Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function EarningOverview({ transactions = [] }) {
  const [selectedMonth, setSelectedMonth] = useState("This Month");

  // Helper to format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount.toFixed(2)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Generate weekly data for a specific month
  const getWeeklyData = (year, month) => {
    const weeklyData = [];
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const weekStart = (weekNum - 1) * 7 + 1;
      const weekEnd = Math.min(weekNum * 7 + 1, lastDay + 1);

      let weeklyIncome = 0;
      transactions.forEach((t) => {
        if (t.amount > 0 && t.date) {
          const transactionDate = new Date(t.date);
          const transactionDay = transactionDate.getDate();
          if (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year &&
            transactionDay >= weekStart &&
            transactionDay < weekEnd
          ) {
            weeklyIncome += t.amount;
          }
        }
      });

      weeklyData.push({
        month: `Week ${weekNum}`,
        income: Math.round(weeklyIncome * 100) / 100,
      });
    }

    return weeklyData;
  };

  // Generate monthly data for specified number of months
  const getMonthlyData = (numMonths) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyData = [];
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      let monthlyIncome = 0;
      transactions.forEach((t) => {
        if (t.amount > 0 && t.date) {
          const transactionDate = new Date(t.date);
          if (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          ) {
            monthlyIncome += t.amount;
          }
        }
      });

      monthlyData.push({
        month: MONTH_NAMES[month],
        income: Math.round(monthlyIncome * 100) / 100,
        fullMonth: month,
        fullYear: year,
      });
    }

    return monthlyData;
  };

  // Dynamically generate chart data based on selected filter
  const chartData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let data = [];

    if (selectedMonth === "This Month") {
      data = getWeeklyData(currentYear, currentMonth);
    } else if (selectedMonth === "Last Month") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      data = getWeeklyData(lastMonthYear, lastMonth);
    } else if (selectedMonth === "Last 3 Months") {
      data = getMonthlyData(3);
    } else {
      // Last 6 Months
      data = getMonthlyData(6);
    }

    // Mark the last item as active
    if (data.length > 0) {
      data = data.map((item, index) => ({
        ...item,
        isActive: index === data.length - 1,
      }));
    }

    return data;
  }, [transactions, selectedMonth]);

  // Get selected month data and calculate trend
  const selectedMonthData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let selectedMonthIncome = 0;
    let selectedMonthDisplay = "";
    let trend = 0;
    let trendPositive = true;
    let selectedMonthIndex = chartData.length - 1;

    if (selectedMonth === "This Month") {
      // Sum all weeks for this month
      selectedMonthIncome = chartData.reduce(
        (sum, item) => sum + item.income,
        0,
      );
      selectedMonthDisplay = MONTH_NAMES[currentMonth];

      // Calculate trend based on last 2 weeks
      if (chartData.length >= 2) {
        const currentWeek = chartData[chartData.length - 1].income;
        const previousWeek = chartData[chartData.length - 2].income;
        if (previousWeek > 0) {
          trend = (((currentWeek - previousWeek) / previousWeek) * 100).toFixed(
            1,
          );
          trendPositive = currentWeek >= previousWeek;
        }
      }
    } else if (selectedMonth === "Last Month") {
      // Sum all weeks for last month
      selectedMonthIncome = chartData.reduce(
        (sum, item) => sum + item.income,
        0,
      );
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      selectedMonthDisplay = MONTH_NAMES[lastMonth];
    } else if (selectedMonth === "Last 3 Months") {
      // Sum all 3 months
      selectedMonthIncome = chartData.reduce(
        (sum, item) => sum + item.income,
        0,
      );
      selectedMonthDisplay = "Last 3 Months";

      // Calculate trend between last month and previous month
      if (chartData.length >= 2) {
        const lastMonthIncome = chartData[chartData.length - 1].income;
        const previousMonthIncome = chartData[chartData.length - 2].income;
        if (previousMonthIncome > 0) {
          trend = (
            ((lastMonthIncome - previousMonthIncome) / previousMonthIncome) *
            100
          ).toFixed(1);
          trendPositive = lastMonthIncome >= previousMonthIncome;
        }
      }
    } else {
      // Last 6 Months
      selectedMonthIncome = chartData.reduce(
        (sum, item) => sum + item.income,
        0,
      );
      selectedMonthDisplay = "Last 6 Months";

      // Calculate trend between last month and previous month
      if (chartData.length >= 2) {
        const lastMonthIncome = chartData[chartData.length - 1].income;
        const previousMonthIncome = chartData[chartData.length - 2].income;
        if (previousMonthIncome > 0) {
          trend = (
            ((lastMonthIncome - previousMonthIncome) / previousMonthIncome) *
            100
          ).toFixed(1);
          trendPositive = lastMonthIncome >= previousMonthIncome;
        }
      }
    }

    return {
      income: selectedMonthIncome,
      month: selectedMonthDisplay,
      trend: trend,
      trendPositive: trendPositive,
      selectedMonthIndex: selectedMonthIndex,
    };
  }, [selectedMonth, chartData]);

  return (
    <div className="earning-chart-container">
      {/* Header with Month Dropdown */}
      <div className="earning-header">
        <h3 className="earning-title">Earning Overview</h3>
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

      {/* Value Section */}
      <div className="earning-value-section">
        <div className="value-display">
          <h2 className="earning-value">
            ${formatCurrency(selectedMonthData.income)}
          </h2>
          {selectedMonthData.trend !== 0 && (
            <span
              className={`earning-trend ${selectedMonthData.trendPositive ? "positive" : "negative"}`}
            >
              {selectedMonthData.trendPositive ? "+" : ""}
              {selectedMonthData.trend}%{" "}
              {selectedMonthData.trendPositive ? "↑" : "↓"}
            </span>
          )}
        </div>
        <p className="month-label">
          {selectedMonthData.month}: ${formatCurrency(selectedMonthData.income)}
        </p>
      </div>

      {/* Chart */}
      <div className="earning-chart">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Active bar gradient - blue */}
              <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
              </linearGradient>
              {/* Inactive bar gradient - gray */}
              <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d1d5db" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#e5e7eb" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f2f5"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              style={{ fontSize: "11px" }}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: "10px" }}
              width={40}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#374151" }}
              formatter={(value) => [`$${formatCurrency(value)}`, "Income"]}
              cursor={{ fill: "rgba(37, 99, 235, 0.05)" }}
            />
            <Bar
              dataKey="income"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isActive
                      ? "url(#activeGradient)"
                      : "url(#inactiveGradient)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
