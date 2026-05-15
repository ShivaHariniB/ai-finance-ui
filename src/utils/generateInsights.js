/**
 * Analyzes transaction data and generates AI-powered financial insights
 */

export const generateInsights = (transactions = []) => {
  const insights = [];

  if (!transactions || transactions.length === 0) {
    return insights;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  if (currentMonthTransactions.length === 0) {
    return insights;
  }

  // Category keywords for inference
  const categoryKeywords = {
    Food: ["food", "restaurant", "grocery", "groceries"],
    "House Rent": ["rent", "housing"],
    Transport: ["transport", "taxi", "uber"],
    Entertainment: ["entertainment", "movie", "game"],
    Shopping: ["shopping", "mall", "store"],
    Subscription: ["subscription", "netflix", "spotify", "gym"],
  };

  // Helper to infer category
  const inferCategory = (name) => {
    if (!name) return "Other";
    const nameLower = name.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => nameLower.includes(keyword))) {
        return category;
      }
    }
    return "Other";
  };

  // Categorize expenses and income
  const categoryTotals = {};
  let totalExpenses = 0;
  let totalIncome = 0;

  currentMonthTransactions.forEach((t) => {
    const category = t.category || inferCategory(t.name || "");
    const amount = Math.abs(t.amount);

    if (t.amount < 0) {
      // Expense
      totalExpenses += amount;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    } else if (t.amount > 0) {
      // Income
      totalIncome += amount;
    }
  });

  // 1. Highest Spending Category Insight
  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  if (highestCategory) {
    const [category, amount] = highestCategory;
    const percentage = ((amount / totalExpenses) * 100).toFixed(0);
    insights.push({
      id: "highest-spending",
      type: "info",
      icon: "📊",
      title: "Top Spending Category",
      message: `You spent the most on ${category} (${percentage}% of your expenses at $${amount.toFixed(2)}).`,
    });
  }

  // 2. Spending Spike Alert
  // Calculate average vs current spending for each category
  const lastMonthTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const transactionDate = new Date(t.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      transactionDate.getMonth() === lastMonth &&
      transactionDate.getFullYear() === lastMonthYear
    );
  });

  let lastMonthExpenses = 0;
  lastMonthTransactions.forEach((t) => {
    if (t.amount < 0) {
      lastMonthExpenses += Math.abs(t.amount);
    }
  });

  if (lastMonthExpenses > 0 && totalExpenses > lastMonthExpenses * 1.2) {
    const increase = (
      ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) *
      100
    ).toFixed(0);
    const spikeCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];
    insights.push({
      id: "spending-spike",
      type: "warning",
      icon: "⚠️",
      title: "Spending Alert",
      message: `Your spending increased by ${increase}% compared to last month. Be mindful of ${spikeCategory ? spikeCategory[0] : "expenses"}.`,
    });
  }

  // 3. Savings Observation
  if (totalIncome > 0) {
    const savingsAmount = totalIncome - totalExpenses;
    const savingsPercentage = ((savingsAmount / totalIncome) * 100).toFixed(0);

    if (savingsAmount >= 0) {
      insights.push({
        id: "savings",
        type: "success",
        icon: "✅",
        title: "Savings Achieved",
        message: `Great job! You saved ${savingsPercentage}% of your income this month ($${savingsAmount.toFixed(2)}).`,
      });
    } else {
      insights.push({
        id: "savings",
        type: "warning",
        icon: "⚠️",
        title: "Overspending Alert",
        message: `You spent ${Math.abs(savingsPercentage)}% more than your income this month.`,
      });
    }
  }

  // 4. Subscription / Recurring Expense Insight
  const subscriptionKeywords = [
    "subscription",
    "netflix",
    "spotify",
    "gym",
    "premium",
    "membership",
  ];
  const subscriptionTransactions = currentMonthTransactions.filter((t) => {
    const nameLower = (t.name || "").toLowerCase();
    return subscriptionKeywords.some((keyword) => nameLower.includes(keyword));
  });

  if (subscriptionTransactions.length > 0) {
    const subscriptionTotal = subscriptionTransactions.reduce((sum, t) => {
      return sum + Math.abs(t.amount);
    }, 0);
    insights.push({
      id: "subscriptions",
      type: "info",
      icon: "🔄",
      title: "Recurring Expenses",
      message: `You have ${subscriptionTransactions.length} subscription(s) totaling $${subscriptionTotal.toFixed(2)} this month.`,
    });
  }

  return insights;
};
