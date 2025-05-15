export const computeSkinScore = (impurities) => {
  if (!impurities?.length) return 100;
  const totalImpurity = impurities.reduce((sum, { value }) => sum + value, 0);
  return Math.round(100 - totalImpurity / impurities.length);
};

export const enrichImpurities = (impurities, skinIssues) => {
  return impurities.map((impurity) => ({
    ...impurity,
    image: skinIssues[impurity.label]?.image || "",
    description:
      skinIssues[impurity.label]?.description || "No description available",
  }));
};

export const getColorByValue = (value) => {
  if (value >= 75) return "#dc2626"; // Red for severe
  if (value >= 50) return "#facc15"; // Yellow for moderate
  if (value >= 25) return "#34d399"; // Green for mild
  return "#3b82f6"; // Blue for very low
};
