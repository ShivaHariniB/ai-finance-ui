import React, { useState } from "react";
import "./Header.css";

export default function Header({ onTransactionsUpload = () => {} }) {
  const fileInputRef = React.useRef(null);

  // Function to parse CSV string into JSON
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const parsed = lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      const row = { id: index + 1 };

      headers.forEach((header, headerIndex) => {
        if (header === "amount") {
          row[header] = parseFloat(values[headerIndex]) || 0;
        } else {
          row[header] = values[headerIndex];
        }
      });

      // Add type field (income/expense) - default to expense if not specified
      if (!row.type) {
        row.type = row.amount < 0 ? "expense" : "income";
      }

      // Add default status if not provided
      if (!row.status) {
        row.status = "Completed";
      }

      // Add default icon based on category
      if (!row.icon) {
        const catLower = (row.category || "").toLowerCase();
        if (catLower.includes("food")) row.icon = "🍔";
        else if (catLower.includes("transport")) row.icon = "🚗";
        else if (catLower.includes("entertainment")) row.icon = "🎬";
        else if (catLower.includes("shopping")) row.icon = "🛍️";
        else if (catLower.includes("bill")) row.icon = "📄";
        else if (catLower.includes("salary") || catLower.includes("income"))
          row.icon = "💰";
        else row.icon = "💳";
      }

      return row;
    });

    return parsed;
  };

  // Handle CSV file upload
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const parsedData = parseCSV(csvText);
        onTransactionsUpload(parsedData);
        console.log("Parsed transactions:", parsedData);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const triggerCSVUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="page-title">Welcome back, Harini</h2>
      </div>
      <div className="header-right">
        <button className="search-btn">🔍</button>
        <button className="upload-csv-btn" onClick={triggerCSVUpload}>
          📤 Upload CSV
        </button>
        <button className="connect-bank-btn">🏦 Connect Bank</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          style={{ display: "none" }}
        />
        <button className="notification-btn">🔔</button>
      </div>
    </header>
  );
}
