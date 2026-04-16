import React, { useState } from "react";
import Header from "./Header.js";
import TransactionList from "../sections/TransactionList.js";
import "./Dashboard.css";
import Sidebar from "./Sidebar.js";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-layout">
        <Header onTransactionsUpload={setTransactions} />
        <main className="main-content">
          <div className="content-inner"></div>
        </main>
        <div className="transaction-section">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
