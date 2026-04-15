export const mockSummaryCards = [
  {
    id: 1,
    title: "Earning Overview",
    value: "$20,520.32",
    trend: "+1.5%",
    isPositive: true,
    period: "This Month",
    chartData: [100, 150, 120, 180, 160, 200, 140],
  },
  {
    id: 2,
    title: "Spending Overview",
    value: "$20,520.32",
    trend: "+15%",
    isPositive: false,
    period: "This Month",
    chartData: [100, 150, 120, 180, 160, 200, 140],
  },
];

export const mockSpendingBreakdown = [
  { label: "House Rent", value: 2000, color: "#2563EB" },
  { label: "Foods", value: 1500, color: "#DBEAFE" },
  { label: "Others", value: 800, color: "#D1D5DB" },
];

export const mockLineChartData = [
  { month: "Jan", value: 8000 },
  { month: "Feb", value: 12000 },
  { month: "Mar", value: 9500 },
  { month: "Apr", value: 14000 },
  { month: "May", value: 13500 },
  { month: "Jun", value: 16000 },
];

export const mockCashFlowData = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 15000 },
  { month: "Mar", value: 10000 },
  { month: "Apr", value: 18000 },
  { month: "May", value: 16000 },
  { month: "Jun", value: 20000 },
  { month: "Jul", value: 19000 },
  { month: "Aug", value: 22000 },
  { month: "Sep", value: 18000 },
  { month: "Oct", value: 21000 },
  { month: "Nov", value: 23000 },
  { month: "Dec", value: 25000 },
];

export const mockUpcomingBills = [
  {
    id: 1,
    icon: "🎬",
    name: "Netflix Subscription",
    date: "June 28, 2026",
    amount: "$15.99",
    status: "Scheduled",
  },
  {
    id: 2,
    icon: "🎵",
    name: "Spotify Premium",
    date: "June 30, 2025",
    amount: "$9.99",
    status: "Scheduled",
  },
  {
    id: 3,
    icon: "🎨",
    name: "Adobe Creative Cloud",
    date: "July 4, 2025",
    amount: "$52.99",
    status: "Scheduled",
  },
];

export const mockTransactions = [
  {
    id: 1,
    icon: "📱",
    name: "Mobile App Purchase",
    date: "Wed 10:29 AM",
    amount: "+$25,500",
    status: "Success",
  },
  {
    id: 2,
    icon: "💿",
    name: "Software License",
    date: "Wed 10:29 AM",
    amount: "+$25,500",
    status: "Success",
  },
];
