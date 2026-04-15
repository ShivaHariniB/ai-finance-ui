import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, label: "Home", icon: "📊", active: true },
    { id: 2, label: "Wallets", icon: "💳" },
    { id: 3, label: "Analytics", icon: "📈" },
    { id: 4, label: "Transactions", icon: "💰" },
    { id: 5, label: "Invoices", icon: "📄" },
  ];

  const featureItems = [
    { id: 6, label: "Recurring", icon: "🔄" },
    { id: 7, label: "Subscriptions", icon: "🎯" },
    { id: 8, label: "Feedback", icon: "💬" },
  ];

  const generalItems = [
    { id: 9, label: "Settings", icon: "⚙️" },
    { id: 10, label: "Help Desk", icon: "❓" },
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
          <h1 className="logo">💰 FinApp</h1>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>

        {/* Main Menu */}
        <div className="menu-section">
          <p className="menu-label">MAIN MENU</p>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href="#/"
                className={`nav-item ${item.active ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Features */}
        <div className="menu-section">
          <p className="menu-label">FEATURES</p>
          <nav className="sidebar-nav">
            {featureItems.map((item) => (
              <a key={item.id} href="#/" className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* General */}
        <div className="menu-section">
          <p className="menu-label">GENERAL</p>
          <nav className="sidebar-nav">
            {generalItems.map((item) => (
              <a key={item.id} href="#/" className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Plan section */}
        <div className="sidebar-plan">
          <h4 className="plan-title">Starter Plan</h4>
          <p className="plan-desc">
            Upgrade to the enterprise plan & get attractive discounts
          </p>
          <button className="upgrade-btn">Upgrade Plan</button>
        </div>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn">🚪 Log out</button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
