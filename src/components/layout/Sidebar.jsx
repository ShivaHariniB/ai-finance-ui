import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({
  activeMenuItem = "home",
  onMenuItemClick = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, label: "Home", icon: "bi-grid", key: "home" },
    { id: 2, label: "Wallets", icon: "bi-wallet2", key: "wallets" },
    { id: 3, label: "Analytics", icon: "bi-bar-chart", key: "analytics" },
    {
      id: 4,
      label: "Transactions",
      icon: "bi-arrow-left-right",
      key: "transactions",
    },
    { id: 5, label: "Invoices", icon: "bi-file-text", key: "invoices" },
  ];

  const generalItems = [
    { id: 9, label: "Settings", icon: "bi-gear", key: "settings" },
    { id: 10, label: "Help Desk", icon: "bi-question-circle", key: "helpdesk" },
  ];

  const handleMenuClick = (key) => {
    onMenuItemClick(key);
    setIsOpen(false); // Close mobile menu on selection
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <a
        key={item.id}
        href="#/"
        className={`nav-item ${activeMenuItem === item.key ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handleMenuClick(item.key);
        }}
      >
        <i className={`bi ${item.icon} nav-icon`}></i>
        <span className="nav-label">{item.label}</span>
      </a>
    ));
  };

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
            <nav className="sidebar-nav">{renderMenuItems(menuItems)}</nav>
          </div>

          {/* General */}
          <div className="menu-section">
            <p className="menu-label">GENERAL</p>
            <nav className="sidebar-nav">{renderMenuItems(generalItems)}</nav>
          </div>
        </div>

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
