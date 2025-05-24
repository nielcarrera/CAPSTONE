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

      { subject: "Freckles", A: 35 },
    ],
    analytics: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Redness", value: 50 },
      { label: "Wrinkles", value: 30 },
      { label: "Blackheads", value: 35 },
      { label: "Acne", value: 40 },

      { label: "Freckles", value: 45 },
    ],
    impurities: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },

      { label: "Redness", value: 50 },
      { label: "Freckles", value: 45 },
      { label: "Acne", value: 40 },
      { label: "Blackheads", value: 35 },
      { label: "Wrinkles", value: 30 },
    ],
    bodyImpurities: [
      { name: "Melasma", location: "Left Arm", date: "2024-02-20" },
      { name: "Sun Spot", location: "Neck", date: "2024-02-20" },
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

      { label: "Freckles", value: 35 },
    ],
    impurities: [
      { label: "Blackheads", value: 75 },
      { label: "Acne", value: 60 },
      { label: "Pores", value: 55 },
      { label: "Whiteheads", value: 40 },

      { label: "Freckles", value: 35 },
      { label: "Dark Circles", value: 30 },
      { label: "Wrinkles", value: 25 },
    ],
    bodyImpurities: [{ name: "Acne", location: "Back", date: "2024-01-20" }],
  },
};

export const BODY_ANALYSIS_DATA = {
  "May 15, 2023": {
    impurities: [
      {
        id: "1",
        label: "Keratosis Pilaris",
        value: 65,
        bodyPart: "Arms",
        image: "https://example.com/keratosis-pilaris.jpg",
        description:
          "Small, rough bumps on the skin, often on the upper arms, thighs, cheeks or buttocks.",
        causes: [
          "Excess keratin production blocking hair follicles",
          "Genetic predisposition",
          "Dry skin conditions",
        ],
        triggers: [
          "Cold, dry weather",
          "Hard water",
          "Certain soaps and detergents",
        ],
        cautions: [
          "Avoid harsh scrubbing",
          "Don't pick at bumps",
          "Avoid very hot showers",
        ],
      },
      {
        id: "2",
        label: "Athlete's Foot",
        value: 45,
        bodyPart: "Feet",
        image: "https://example.com/athletes-foot.jpg",
        description:
          "Fungal infection causing itching, stinging, and burning between toes or on soles.",
        causes: [
          "Fungal infection (Trichophyton)",
          "Walking barefoot in damp areas",
          "Wearing tight, closed-toe shoes",
        ],
        triggers: [
          "Public showers/pools",
          "Sweaty feet",
          "Shared towels/shoes",
        ],
        cautions: [
          "Keep feet dry",
          "Don't share footwear",
          "Wear shower shoes in public areas",
        ],
      },
      // Add 6 more impurities with different body parts
      {
        id: "3",
        label: "Eczema",
        value: 55,
        bodyPart: "Hands",
        image: "https://example.com/eczema.jpg",
        description:
          "Inflammatory condition causing itchy, red, and cracked skin.",
        causes: [
          "Genetic factors",
          "Immune system dysfunction",
          "Skin barrier defects",
        ],
        triggers: [
          "Irritants (soaps, detergents)",
          "Stress",
          "Weather changes",
        ],
        cautions: [
          "Avoid known triggers",
          "Moisturize regularly",
          "Use gentle cleansers",
        ],
      },
      {
        id: "4",
        label: "Acne Mechanica",
        value: 40,
        bodyPart: "Back",
        image: "https://example.com/acne-mechanica.jpg",
        description:
          "Acne caused by friction, pressure, or heat against the skin.",
        causes: [
          "Friction from clothing/equipment",
          "Excess sweat trapped against skin",
          "Pressure on skin for prolonged periods",
        ],
        triggers: ["Sports equipment", "Tight clothing", "Backpacks"],
        cautions: [
          "Wear breathable fabrics",
          "Shower after sweating",
          "Avoid tight clothing",
        ],
      },
      {
        id: "5",
        label: "Intertrigo",
        value: 35,
        bodyPart: "Thighs",
        image: "https://example.com/intertrigo.jpg",
        description:
          "Inflammation in skin folds caused by friction and moisture.",
        causes: [
          "Skin-to-skin friction",
          "Moisture in body folds",
          "Bacterial or fungal overgrowth",
        ],
        triggers: ["Obesity", "Diabetes", "Hot/humid weather"],
        cautions: [
          "Keep area dry",
          "Wear moisture-wicking fabrics",
          "Use barrier creams",
        ],
      },
      {
        id: "6",
        label: "Folliculitis",
        value: 30,
        bodyPart: "Legs",
        image: "https://example.com/folliculitis.jpg",
        description: "Infection and inflammation of hair follicles.",
        causes: [
          "Bacterial infection (Staph)",
          "Friction from shaving",
          "Ingrown hairs",
        ],
        triggers: [
          "Tight clothing",
          "Hot tubs/swimming pools",
          "Shaving/waxing",
        ],
        cautions: [
          "Avoid shaving infected areas",
          "Don't share razors",
          "Wear loose clothing",
        ],
      },
      {
        id: "7",
        label: "Contact Dermatitis",
        value: 25,
        bodyPart: "Neck",
        image: "https://example.com/contact-dermatitis.jpg",
        description:
          "Red, itchy rash caused by direct contact with a substance.",
        causes: [
          "Allergic reaction (nickel, fragrances)",
          "Irritants (soaps, chemicals)",
          "Poison ivy/oak",
        ],
        triggers: ["Jewelry", "Cosmetics", "Cleaning products"],
        cautions: [
          "Identify and avoid triggers",
          "Use hypoallergenic products",
          "Wear protective gloves",
        ],
      },
      {
        id: "8",
        label: "Tinea Versicolor",
        value: 20,
        bodyPart: "Chest",
        image: "https://example.com/tinea-versicolor.jpg",
        description:
          "Fungal infection causing small, discolored patches on skin.",
        causes: ["Yeast overgrowth (Malassezia)", "Oily skin", "Humid weather"],
        triggers: ["Hot weather", "Excessive sweating", "Oily skin products"],
        cautions: [
          "Avoid excessive sweating",
          "Use antifungal shampoo",
          "Wear breathable fabrics",
        ],
      },
    ],
  },
  "April 28, 2023": {
    impurities: [
      // Different set of impurities for this date
    ],
  },
};

export const BODY_PARTS = [
  "Scalp",
  "Neck",
  "Shoulders",
  "Arms",
  "Hands",
  "Chest and Upper Back",
  "Lower Back and Abdomen",
  "Thighs",
  "Legs",
  "Feet",
];

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
