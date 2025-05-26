// src/Pages/utils/Productdata.js

// Helper function to generate consistent product structure
const createProduct = (productData) => ({
  id: productData.id || productData.product_id,
  type: productData.type || productData.product_type,
  name: productData.name || productData.product_name,
  description: productData.description,
  severity: productData.severity,
  area: productData.area,
  image: productData.image,
  ingredients: productData.ingredients,
  skinType: productData.skinType || productData.skintype,
  impurity: productData.impurity,
  cautions: productData.cautions,
  usage: productData.usage,
  brand: productData.brand || "",
  createdAt:
    productData.createdAt || productData.created_at || new Date().toISOString(),
  // Additional fields that might come from Supabase
  ...productData,
});

// Dummy products with structure matching Supabase response
export const products = [
  createProduct({
    product_id: "1",
    product_type: "cleanser",
    product_name: "Salicylic Acid Cleanser",
    description: "Dissolves excess oil and clears pores",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
    severity: "mild",
    skintype: "oily",
    impurity: "whiteheads",
    area: "face",
    ingredients: ["2% Salicylic Acid", "Niacinamide"],
    cautions:
      "May cause dryness or irritation. Avoid mixing with strong acids or retinoids.",
    usage: "Use twice daily; rinse thoroughly",

    created_at: "2023-10-01",
  }),
  createProduct({
    product_id: "2",
    product_type: "treatment",
    product_name: "Benzoyl Peroxide Treatment Gel",
    description: "Treats severe acne and whiteheads",
    image: "https://images.unsplash.com/photo-1611077544417-2fc92be21ccf?w=500",
    severity: "severe",
    skintype: "oily",
    impurity: "whiteheads",
    area: "face",
    ingredients: ["10% Benzoyl Peroxide", "Aloe Vera"],
    cautions: "Avoid contact with eyes. May bleach fabrics.",
    usage: "Apply thin layer to affected area once daily at night",

    created_at: "2023-09-12",
  }),
  // Add more dummy products following the same pattern
  createProduct({
    product_id: "3",
    product_type: "cleanser",
    product_name: "Hydrating Cream Cleanser",
    description: "Cleanses while maintaining hydration",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500",
    severity: "mild",
    skintype: "dry",
    impurity: "whiteheads",
    area: "face",
    ingredients: ["Hyaluronic Acid", "Aloe Vera"],
    cautions: "For external use only. Discontinue if irritation occurs.",
    usage: "Use morning and night on damp skin.",

    created_at: "2023-08-18",
  }),
  createProduct({
    product_id: "4",
    product_type: "moisturizer",
    product_name: "Ultra Body Lotion",
    description: "Hydrates and nourishes dry skin on arms and legs.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
    severity: "mild",
    skintype: "dry",
    impurity: "none",
    area: "body",
    bodyPart: "arm",
    ingredients: ["Shea Butter", "Vitamin E"],
    cautions: "",
    usage: "Apply daily after shower.",

    created_at: "2023-07-01",
  }),
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
  return products.slice(0, 3);
};
