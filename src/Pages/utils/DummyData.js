export const mockUser = {
  firstName: "Venniel",
  lastName: "Carrera",
  nickname: "debi",
  email: "vennielcarrera@gmail.com",
  age: "20",
  gender: "Male",
  skinType: "Oily",
  height: "175",
  weight: "70",
  avatar: "https://via.placeholder.com/150",
};

export const mockRoutines = [
  {
    id: 1,
    name: "Morning Routine",
    time: "7:00 AM",
    steps: 4,
    products: [
      "Salicylic Acid Cleanser",
      "Hydrating Toner",
      "Vitamin C Serum",
      "Moisturizing Cream",
    ],
  },
];

export const BODY_ANALYSIS_DATA = {
  "May 15, 2023": {},
};

export const SEVERITY_COLORS = {
  severe: "bg-red-500",
  moderate: "bg-orange-500",
  mild: "bg-green-500",
  default: "bg-violet-500",
};

export const getColorByValue = (value) => {
  if (value >= 80) return "#ea384c";
  if (value >= 60) return "#F97316";
  if (value >= 40) return "#eab308";
  return "#22c55e";
};

export const getSeverityColor = (severity) =>
  SEVERITY_COLORS[severity] || "bg-gray-300";

export const calculateSkinScore = (analytics) => {
  if (!analytics || analytics.length === 0) return 0;
  const total = analytics.reduce((sum, item) => sum + item.value, 0);
  const average = total / analytics.length;
  return Math.round(100 - average);
};

export const getTopProblems = (analytics) => {
  if (!analytics) return [];
  return [...analytics]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => ({
      label: item.label,
      value: item.value,
      severity:
        item.value >= 75 ? "severe" : item.value >= 50 ? "moderate" : "mild",
    }));
};

export const getRecentBodyImpurities = () => {
  const allImpurities = [];

  // Flatten all impurities from all dates into one array
  Object.values(BODY_ANALYSIS_DATA).forEach((analysis) => {
    if (analysis.impurities) {
      allImpurities.push(...analysis.impurities);
    }
  });

  // Sort by date found (newest first)
  allImpurities.sort((a, b) => new Date(b.dateFound) - new Date(a.dateFound));

  // Return top 3 most recent
  return allImpurities.slice(0, 3);
};
