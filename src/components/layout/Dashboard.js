import React from "react";
import Sidebar from "./Sidebar.js";
import Header from "./Header.js";
import SummaryCards from "../cards/SummaryCards.js";
import ChartsSection from "../charts/ChartsSection.js";
import UpcomingBills from "../sections/UpcomingBills.js";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div className="content-inner">
          <SummaryCards />
          <ChartsSection />
          <div className="bottom-section">
            <div></div>
            <UpcomingBills />
          </div>
        </div>
      </main>
    </div>
  );
}
