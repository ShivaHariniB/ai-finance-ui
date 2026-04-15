import React from "react";
import SummaryCard from "./SummaryCard.js";
import { mockSummaryCards } from "../../utils/mockData.js";
import "./SummaryCards.css";

export default function SummaryCards() {
  return (
    <div className="summary-cards-container">
      {mockSummaryCards.map((card) => (
        <SummaryCard
          key={card.id}
          title={card.title}
          value={card.value}
          trend={card.trend}
          isPositive={card.isPositive}
          period={card.period}
        />
      ))}
    </div>
  );
}
