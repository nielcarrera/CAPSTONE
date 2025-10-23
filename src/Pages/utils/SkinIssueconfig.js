// src/config/skinIssuesConfig.js
import blackheads from "../../assets/blackheads.jpg";
import whiteheads from "../../assets/whiteheads.jpg";
import acne from "../../assets/acne.jpg";
import pores from "../../assets/pores.webp";
import redness from "../../assets/redness.jpg";
import wrinkles from "../../assets/wrinkles.jpg";
import darkcircles from "../../assets/darkcircles.jpg";

export const skinIssues = {
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
  Darkcircles: {
    image: darkcircles,
    description:
      "Darkened areas under the eyes due to thinning skin or blood vessel visibility.",
  },
};

export const skinIssueDetails = {
  Pores: {
    cause: "Genetics, excess sebum, sun damage, and aging.",
    prevention:
      "Daily SPF use, oil control with niacinamide, exfoliation with salicylic acid.",
    references: [
      {
        source: "Cleveland Clinic – Clogged pores overview",
        url: "https://my.clevelandclinic.org/health/diseases/22773-clogged-pores",
      },
      {
        source: "Cleveland Clinic – How to shrink pores",
        url: "https://health.clevelandclinic.org/how-to-shrink-pores",
      },
    ],
  },
  Redness: {
    cause: "Inflammation, rosacea, sunburn, or skin irritation.",
    prevention:
      "Avoid harsh products and hot water, use calming skincare, wear sunscreen.",
    references: [
      {
        source: "AAD – Rosacea triggers & flare-ups",
        url: "https://www.aad.org/public/diseases/rosacea/triggers/prevent",
      },
      {
        source: "Mayo Clinic – Rosacea symptoms & causes",
        url: "https://www.mayoclinic.org/diseases-conditions/rosacea/symptoms-causes/syc-20353815",
      },
    ],
  },
  Acne: {
    cause:
      "Blocked hair follicles due to oil, bacteria, and hormonal imbalance.",
    prevention:
      "Consistent cleansing, avoid heavy cosmetics, manage stress and diet.",
    references: [
      {
        source: "Mayo Clinic – Acne causes & symptoms",
        url: "https://www.mayoclinic.org/diseases-conditions/acne/symptoms-causes/syc-20368047",
      },
    ],
  },
  Blackheads: {
    cause: "Open clogged pores filled with oxidized oil and dead skin.",
    prevention:
      "Exfoliate with BHA (salicylic acid), double cleanse, avoid pore-clogging products.",
    references: [
      {
        source: "Cleveland Clinic – Clogged pores",
        url: "https://my.clevelandclinic.org/health/diseases/22773-clogged-pores",
      },
    ],
  },
  Wrinkles: {
    cause: "UV damage, aging, loss of collagen and elastin.",
    prevention:
      "Daily sunscreen, antioxidant-rich skincare, stay hydrated, avoid smoking.",
    references: [
      {
        source: "Mayo Clinic – Wrinkles causes & prevention",
        url: "https://www.mayoclinic.org/diseases-conditions/wrinkles/symptoms-causes/syc-20354423",
      },
    ],
  },
  Darkcircles: {
    cause: "Thinning skin under eyes, lack of sleep, or genetics.",
    prevention:
      "Get adequate sleep, use caffeine-based eye creams, protect from sun.",
    references: [
      {
        source: "Cleveland Clinic – Dark circles under eyes",
        url: "https://my.clevelandclinic.org/health/diseases/22664-dark-circles-under-eyes",
      },
    ],
  },
};
