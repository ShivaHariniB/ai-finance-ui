import React from "react";
import { mockUpcomingBills } from "../../utils/mockData.js";
import "./UpcomingBills.css";

export default function UpcomingBills() {
  return (
    <div className="upcoming-bills-card">
      <div className="bills-header">
        <h3 className="section-title">Upcoming Bill & Payment</h3>
        <button className="add-btn">+</button>
      </div>

      <div className="bills-list">
        {mockUpcomingBills.map((bill) => (
          <div key={bill.id} className="bill-item">
            <div className="bill-icon">{bill.icon}</div>
            <div className="bill-info">
              <p className="bill-name">{bill.name}</p>
              <p className="bill-date">{bill.date}</p>
            </div>
            <div className="bill-right">
              <div className="bill-amount">{bill.amount}</div>
              <span className="bill-status">{bill.status}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-btn">View All</button>
    </div>
  );
}
