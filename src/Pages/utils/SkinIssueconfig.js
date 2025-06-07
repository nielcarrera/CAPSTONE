// src/config/skinIssuesConfig.js
import blackheads from "../../assets/blackheads.jpg";
import whiteheads from "../../assets/whiteheads.jpg";
import acne from "../../assets/acne.jpg";
import pores from "../../assets/pores.webp";

import redness from "../../assets/redness.webp";

import wrinkles from "../../assets/wrinkles.jpg";
import darkcircles from "../../assets/darkcircles.jpg";

export const skinIssues = {
  Whiteheads: {
    image: whiteheads,
    description:
      "Small, white bumps that appear when pores become clogged with oil and dead skin cells.",
  },
  Pores: {
    image: pores,
    description: "Enlarged pores that can become clogged and more visible.",
  },

  Redness: {
    image: redness,
    description: "Irritated or inflamed areas of skin causing visible redness.",
  },

  Acne: {
    image: acne,
    description: "Inflammatory skin condition causing pimples and blemishes.",
  },
  Blackheads: {
    image: blackheads,
    description: "Open comedones caused by clogged pores with oxidized sebum.",
  },
  Wrinkles: {
    image: wrinkles,
    description:
      "Fine lines and creases in the skin due to aging or sun damage.",
  },
  "Dark Circles": {
    image: darkcircles,
    description:
      "Darkened areas under the eyes due to thinning skin or blood vessel visibility.",
  },
};

// src/config/skinIssueDetails.js
export const skinIssueDetails = {
  Whiteheads: {
    cause: "Clogged pores from excess oil, dead skin cells, and makeup.",
    prevention:
      "Use non-comedogenic products, cleanse gently, exfoliate regularly.",
  },
  Pores: {
    cause: "Genetics, excess sebum, sun damage, and aging.",
    prevention:
      "Daily SPF use, oil control with niacinamide, exfoliation with salicylic acid.",
  },
  Redness: {
    cause: "Inflammation, rosacea, sunburn, or skin irritation.",
    prevention:
      "Avoid harsh products and hot water, use calming skincare, wear sunscreen.",
  },

  Acne: {
    cause:
      "Blocked hair follicles due to oil, bacteria, and hormonal imbalance.",
    prevention:
      "Consistent cleansing, avoid heavy cosmetics, manage stress and diet.",
  },
  Blackheads: {
    cause: "Open clogged pores filled with oxidized oil and dead skin.",
    prevention:
      "Exfoliate with BHA (salicylic acid), double cleanse, avoid pore-clogging products.",
  },
  Wrinkles: {
    cause: "UV damage, aging, loss of collagen and elastin.",
    prevention:
      "Daily sunscreen, antioxidant-rich skincare, stay hydrated, avoid smoking.",
  },

  "Dark Circles": {
    cause: "Thinning skin under eyes, lack of sleep, or genetics.",
    prevention:
      "Get adequate sleep, use caffeine-based eye creams, protect from sun.",
  },
};
