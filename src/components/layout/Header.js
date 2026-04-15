import React, { useState } from "react";
import "./Header.css";

export default function Header() {
  const [transactions, setTransactions] = useState([]);
  const fileInputRef = React.useRef(null);

  // Function to parse CSV string into JSON
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const parsed = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row = {};

      headers.forEach((header, index) => {
        if (header === "amount") {
          row[header] = parseFloat(values[index]) || 0;
        } else {
          row[header] = values[index];
        }
      });

      // Add type field (income/expense) - default to expense if not specified
      if (!row.type) {
        row.type = row.amount < 0 ? "expense" : "income";
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
        setTransactions(parsedData);
        console.log("Parsed transactions:", parsedData);
      } catch (error) {
        console.error("Error parsing CSV:", error);
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
