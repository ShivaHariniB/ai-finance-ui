import React, { useState } from "react";
import Header from "./Header.jsx";
import TransactionList from "../sections/TransactionList.jsx";
import EarningOverview from "../cards/EarningOverview.jsx";
import SpendingAnalytics from "../charts/SpendingAnalytics.jsx";
import DashboardCard from "../cards/DashboardCard.jsx";
import CashFlowCard from "../cards/CashFlowCard.jsx";
import AIFinancialInsights from "../cards/AIFinancialInsights.jsx";
import "./Dashboard.css";
import Sidebar from "./Sidebar.jsx";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("home");

  return (
    <div className="dashboard">
      <Sidebar
        activeMenuItem={activeMenuItem}
        onMenuItemClick={setActiveMenuItem}
      />
      <div className="main-layout">
        <Header onTransactionsUpload={setTransactions} />
        <main className="main-content">
          <div className="content-inner">
            {/* First Section - Earning and Spending Overview */}
            <div className="dashboard-section">
              <div className="section-row">
                <DashboardCard className="earning-overview-card">
                  <EarningOverview transactions={transactions} />
                </DashboardCard>
                <DashboardCard className="spending-overview-card">
                  <SpendingAnalytics transactions={transactions} />
                </DashboardCard>
              </div>
            </div>

            {/* Second Section - Cash Flow and AI Financial Insights */}
            <div className="dashboard-section">
              <div className="section-row">
                <DashboardCard
                  subtitle="Monthly Overview"
                  className="cash-flow-card"
                >
                  <CashFlowCard transactions={transactions} />
                </DashboardCard>
                <AIFinancialInsights transactions={transactions} />
              </div>
            </div>

            {/* Third Section - Recent Transactions */}
            <div className="dashboard-section">
              <TransactionList transactions={transactions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
