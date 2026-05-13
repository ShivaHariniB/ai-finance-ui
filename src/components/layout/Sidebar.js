import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, label: "Home", icon: "bi-grid" },
    { id: 2, label: "Wallets", icon: "bi-wallet2" },
    { id: 3, label: "Analytics", icon: "bi-bar-chart" },
    { id: 4, label: "Transactions", icon: "bi-arrow-left-right" },
    { id: 5, label: "Invoices", icon: "bi-file-text" },
  ];

  const featureItems = [
    { id: 6, label: "Recurring", icon: "bi-arrow-repeat" },
    { id: 7, label: "Subscriptions", icon: "bi-lightning" },
    { id: 8, label: "Feedback", icon: "bi-chat-dots" },
  ];

  const generalItems = [
    { id: 9, label: "Settings", icon: "bi-gear" },
    { id: 10, label: "Help Desk", icon: "bi-question-circle" },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button className="mobile-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <h1 className="logo">FinApp</h1>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <i className="bi bi-search sidebar-search-icon"></i>
          <input type="text" placeholder="Search" />
        </div>

        {/* Scrollable Menu Container */}
        <div className="sidebar-menu-container">
          {/* Main Menu */}
          <div className="menu-section">
            <p className="menu-label">MAIN MENU</p>
            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <a key={item.id} href="#/" className="nav-item">
                  <i className={`bi ${item.icon} nav-icon`}></i>
                  <span className="nav-label">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Features */}
          {/* <div className="menu-section">
            <p className="menu-label">FEATURES</p>
            <nav className="sidebar-nav">
              {featureItems.map((item) => (
                <a key={item.id} href="#/" className="nav-item">
                  <i className={`bi ${item.icon} nav-icon`}></i>
                  <span className="nav-label">{item.label}</span>
                </a>
              ))}
            </nav>
          </div> */}

          {/* General */}
          <div className="menu-section">
            <p className="menu-label">GENERAL</p>
            <nav className="sidebar-nav">
              {generalItems.map((item) => (
                <a key={item.id} href="#/" className="nav-item">
                  <i className={`bi ${item.icon} nav-icon`}></i>
                  <span className="nav-label">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Plan section */}
        {/* <div className="sidebar-plan">
          <h4 className="plan-title">Starter Plan</h4>
          <p className="plan-desc">
            Upgrade to the enterprise plan & get attractive discounts
          </p>
          <button className="upgrade-btn">Upgrade Plan</button>
        </div> */}

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn">Log out</button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
