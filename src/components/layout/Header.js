import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h2 className="page-title">Home</h2>
      </div>
      <div className="header-right">
        <button className="search-btn">🔍</button>
        <span className="user-name">👤 John Doe</span>
        <button className="notification-btn">🔔</button>
      </div>
    </header>
  );
}
