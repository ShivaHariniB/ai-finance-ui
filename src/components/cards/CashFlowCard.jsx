import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./CashFlowCard.css";

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

export default function CashFlowCard({ transactions = [] }) {
  // Helper to format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount.toFixed(2)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate last 6 months cash flow data
  const chartData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      let monthlyIncome = 0;
      let monthlyExpense = 0;

      transactions.forEach((t) => {
        if (t.date) {
          const transactionDate = new Date(t.date);
          if (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          ) {
            if (t.amount > 0) {
              monthlyIncome += t.amount;
            } else {
              monthlyExpense += Math.abs(t.amount);
            }
          }
        }
      });

      monthlyData.push({
        month: MONTH_NAMES[month],
        income: Math.round(monthlyIncome * 100) / 100,
        expense: Math.round(monthlyExpense * 100) / 100,
        netFlow: Math.round((monthlyIncome - monthlyExpense) * 100) / 100,
      });
    }

    return monthlyData;
  }, [transactions]);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.amount > 0) {
        totalIncome += t.amount;
      } else {
        totalExpense += Math.abs(t.amount);
      }
    });

    const netFlow = totalIncome - totalExpense;
    const trend =
      chartData.length >= 2
        ? chartData[chartData.length - 1].netFlow -
          chartData[chartData.length - 2].netFlow
        : 0;

    return {
      income: totalIncome,
      expense: totalExpense,
      netFlow: netFlow,
      trendPositive: trend >= 0,
      trend: Math.abs(trend),
    };
  }, [transactions, chartData]);

  return (
    <div className="cash-flow-container">
      {/* Header */}
      <div className="cash-flow-header">
        <div className="header-content">
          <h3 className="cash-flow-title">Cash Flow</h3>
          {metrics.netFlow !== 0 && (
            <span
              className={`trend-badge ${metrics.trendPositive ? "positive" : "negative"}`}
            >
              {metrics.trendPositive ? "↑" : "↓"} Trend
            </span>
          )}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-row">
        <div className="metric-item">
          <span className="metric-label">Income</span>
          <span className="metric-value income">
            ${formatCurrency(metrics.income)}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Expenses</span>
          <span className="metric-value expense">
            ${formatCurrency(metrics.expense)}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Net Flow</span>
          <span
            className={`metric-value ${metrics.netFlow >= 0 ? "positive" : "negative"}`}
          >
            ${formatCurrency(Math.abs(metrics.netFlow))}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="cash-flow-chart">
        {chartData.some((d) => d.income > 0 || d.expense > 0) ? (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f2f5"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: "11px" }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: "10px" }}
                width={40}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                labelStyle={{ color: "#f3f4f6" }}
                formatter={(value) => [`$${formatCurrency(value)}`, ""]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "8px", fontSize: "11px" }}
                verticalAlign="bottom"
                height={20}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">
            <p>No cash flow data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
