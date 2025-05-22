// src/Pages/utils/Productdata.js
export const products = [
  // OILY SKIN - WHITEHEADS (FACE)
  {
    id: "1",
    name: "Salicylic Acid Cleanser",

    description: "Dissolves excess oil and clears pores",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    severity: "mild",
    type: "cleanser",
    impurity: "whiteheads",
    skinType: "oily",
    area: "face",
    ingredients: [
      { name: "2% Salicylic Acid", benefit: "Unclogs pores" },
      { name: "Niacinamide", benefit: "Reduces inflammation" },
    ],
    effects: [
      "Clears whiteheads",
      "Reduces excess oil",
      "Prevents future breakouts",
    ],
    createdAt: "2023-10-01",
  },
  {
    id: "2",
    name: "Benzoyl Peroxide Treatment Gel",

    description: "Treats severe acne and whiteheads",
    image:
      "https://images.unsplash.com/photo-1611077544417-2fc92be21ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    severity: "severe",
    type: "treatment",
    impurity: "whiteheads",
    skinType: "oily",
    area: "face",
    ingredients: [
      { name: "10% Benzoyl Peroxide", benefit: "Kills acne bacteria" },
      { name: "Aloe Vera", benefit: "Soothes skin" },
    ],
    effects: [
      "Targets severe whiteheads",
      "Reduces inflammation",
      "Prevents future breakouts",
    ],
    createdAt: "2023-09-20",
  },
  // DRY SKIN - WHITEHEADS (FACE)
  {
    id: "3",
    name: "Hydrating Cream Cleanser",

    description: "Cleanses while maintaining hydration",
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    severity: "mild",
    type: "cleanser",
    impurity: "whiteheads",
    skinType: "dry",
    area: "face",
    ingredients: [
      { name: "Hyaluronic Acid", benefit: "Deep hydration" },
      { name: "Aloe Vera", benefit: "Soothes skin" },
    ],
    effects: [
      "Gentle cleansing",
      "Maintains moisture barrier",
      "Prevents dryness",
    ],
    createdAt: "2023-08-15",
  },
  // COMBINATION SKIN - PORES (FACE)
  {
    id: "4",
    name: "Pore-Refining Toner",

    description: "Controls oil while reducing inflammation",
    image:
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    severity: "moderate",
    type: "toner",
    impurity: "pores",
    skinType: "combination",
    area: "face",
    ingredients: [
      { name: "Witch Hazel", benefit: "Tightens pores" },
      { name: "Green Tea", benefit: "Reduces inflammation" },
    ],
    effects: [
      "Minimizes pore appearance",
      "Balances oil production",
      "Soothes skin",
    ],
    createdAt: "2023-07-10",
  },
  // SENSITIVE SKIN - REDNESS (FACE)
  {
    id: "5",
    name: "Centella Soothing Toner",

    description: "Soothes irritation and hydrates skin",
    image:
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    severity: "moderate",
    type: "toner",
    impurity: "redness",
    skinType: "sensitive",
    area: "face",
    ingredients: [
      { name: "Centella Asiatica", benefit: "Reduces redness" },
      { name: "Allantoin", benefit: "Soothes irritation" },
    ],
    effects: [
      "Calms sensitive skin",
      "Reduces redness",
      "Strengthens skin barrier",
    ],
    createdAt: "2023-06-05",
  },
  // Other products (FACE)
  {
    id: "6",
    name: "BHA + AHA Exfoliant",

    description: "Clears pores and dissolves blackheads",
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    severity: "moderate",
    type: "exfoliant",
    impurity: "blackheads",
    skinType: "oily",
    area: "face",
    ingredients: [
      { name: "Salicylic Acid", benefit: "Unclogs pores" },
      { name: "Glycolic Acid", benefit: "Exfoliates surface" },
    ],
    effects: [
      "Removes blackheads",
      "Prevents future clogging",
      "Smooths skin texture",
    ],
    createdAt: "2023-05-01",
  },
  // BODY PRODUCTS
  {
    id: "7",
    name: "Body Acne Wash",

    description: "Treats acne on back and chest",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",

    type: "cleanser",
    bodyPart: "back",
    area: "body",
    ingredients: [
      { name: "Salicylic Acid", benefit: "Unclogs pores" },
      { name: "Aloe Vera", benefit: "Soothes skin" },
    ],
    effects: [
      "Clears body acne",
      "Reduces inflammation",
      "Prevents future breakouts",
    ],
    createdAt: "2023-04-15",
  },
  {
    id: "8",
    name: "Keratosis Pilaris Lotion",

    description: "Treats rough bumps on arms and legs",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",

    type: "moisturizer",
    bodyPart: "arm",
    area: "body",
    ingredients: [
      { name: "Lactic Acid", benefit: "Exfoliates skin" },
      { name: "Ceramides", benefit: "Restores moisture barrier" },
    ],
    effects: ["Smooths rough skin", "Reduces bumps", "Hydrates dry skin"],
    createdAt: "2023-03-10",
  },
  {
    id: "9",
    name: "Foot Repair Cream",

    description: "Intensive foot moisturizer for dry, cracked feet",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",

    type: "moisturizer",
    bodyPart: "feet",
    area: "body",
    ingredients: [
      { name: "Allantoin", benefit: "Heals cracked skin" },
      { name: "Glycerin", benefit: "Deep hydration" },
    ],
    effects: [
      "Repairs dry, cracked skin",
      "Provides long-lasting moisture",
      "Creates protective barrier",
    ],
    createdAt: "2023-02-05",
  },
  {
    id: "10",
    name: "Neck Firming Cream",

    description: "Targets signs of aging on neck and décolletage",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",

    type: "treatment",
    bodyPart: "neck",
    area: "body",
    ingredients: [
      { name: "Retinol", benefit: "Stimulates collagen" },
      { name: "Niacinamide", benefit: "Brightens skin" },
    ],
    effects: ["Firms neck skin", "Reduces fine lines", "Improves elasticity"],
    createdAt: "2023-01-01",
  },
];

export const skinImpurities = [
  "all",
  "pores",
  "redness",
  "wrinkles",
  "blackheads",
  "darkcircles",
  "acne",
  "oil",
  "freckles",
  "whiteheads",
];

export const skinTypes = [
  "all",
  "normal",
  "oily",
  "dry",
  "combination",
  "sensitive",
];

export const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "severity-asc", label: "Severity (Mild first)" },
  { value: "severity-desc", label: "Severity (Severe first)" },
  { value: "date-asc", label: "Oldest First" },
  { value: "date-desc", label: "Newest First" },
];

export const getRecommendedProducts = () => {
  // Return up to 7 products
  return products.slice(0, 7);
};
