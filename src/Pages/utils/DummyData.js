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

export const ANALYSIS_DATA = {
  "Feb 20, 2024 14:30": {
    keyProblems: [
      { label: "Acne", value: 80, severity: "severe" },
      { label: "Pores", value: 65, severity: "moderate" },
      { label: "Blackheads", value: 50, severity: "mild" },
    ],
    radarData: [
      { subject: "Whiteheads", A: 80 },
      { subject: "Pores", A: 65 },
      { subject: "Redness", A: 40 },
      { subject: "Wrinkles", A: 30 },
      { subject: "Blackheads", A: 50 },
      { subject: "Dark Circles", A: 45 },
      { subject: "Acne", A: 35 },
    ],
    analytics: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Redness", value: 50 },
      { label: "Wrinkles", value: 30 },
      { label: "Blackheads", value: 35 },
      { label: "Acne", value: 40 },
    ],
    impurities: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Redness", value: 50 },

      { label: "Acne", value: 40 },
      { label: "Blackheads", value: 35 },
      { label: "Wrinkles", value: 30 },
    ],
  },
  "Jan 20, 2024 15:45": {
    keyProblems: [
      { label: "Blackheads", value: 75, severity: "severe" },
      { label: "Acne", value: 40, severity: "mild" },
    ],
    radarData: [
      { subject: "Whiteheads", A: 40 },
      { subject: "Pores", A: 55 },
      { subject: "Redness", A: 30 },
      { subject: "Wrinkles", A: 25 },
      { subject: "Blackheads", A: 75 },
      { subject: "Dark Circles", A: 35 },
      { subject: "Acne", A: 40 },
    ],
    analytics: [
      { label: "Whiteheads", value: 40 },
      { label: "Pores", value: 55 },
      { label: "Redness", value: 75 },
      { label: "Wrinkles", value: 25 },
      { label: "Blackheads", value: 40 },
      { label: "Dark Circles", value: 30 },
      { label: "Acne", value: 60 },
    ],
    impurities: [
      { label: "Blackheads", value: 75 },
      { label: "Acne", value: 60 },
      { label: "Pores", value: 55 },
      { label: "Whiteheads", value: 40 },

      { label: "Dark Circles", value: 30 },
      { label: "Wrinkles", value: 25 },
    ],
  },
};

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
