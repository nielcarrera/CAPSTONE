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
      { subject: "Oil", A: 35 },
      { subject: "Freckles", A: 35 },
    ],
    analytics: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Redness", value: 50 },
      { label: "Wrinkles", value: 30 },
      { label: "Blackheads", value: 35 },
      { label: "Acne", value: 40 },
      { label: "Oil", value: 55 },
      { label: "Freckles", value: 45 },
    ],
    impurities: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Oil", value: 55 },
      { label: "Redness", value: 50 },
      { label: "Freckles", value: 45 },
      { label: "Acne", value: 40 },
      { label: "Blackheads", value: 35 },
      { label: "Wrinkles", value: 30 },
    ],
  },
  "Jan 20, 2024 15:45": {
    keyProblems: [
      { label: "Blackheads", value: 75, severity: "severe" },
      { label: "Oil", value: 60, severity: "moderate" },
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
      { subject: "Oil", A: 40 },
      { subject: "Freckles", A: 40 },
    ],
    analytics: [
      { label: "Whiteheads", value: 40 },
      { label: "Pores", value: 55 },
      { label: "Redness", value: 75 },
      { label: "Wrinkles", value: 25 },
      { label: "Blackheads", value: 40 },
      { label: "Dark Circles", value: 30 },
      { label: "Acne", value: 60 },
      { label: "Oil", value: 35 },
      { label: "Freckles", value: 35 },
    ],
    impurities: [
      { label: "Blackheads", value: 75 },
      { label: "Acne", value: 60 },
      { label: "Pores", value: 55 },
      { label: "Whiteheads", value: 40 },
      { label: "Oil", value: 40 },
      { label: "Freckles", value: 35 },
      { label: "Dark Circles", value: 30 },
      { label: "Wrinkles", value: 25 },
    ],
  },
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
