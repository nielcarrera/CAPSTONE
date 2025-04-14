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
