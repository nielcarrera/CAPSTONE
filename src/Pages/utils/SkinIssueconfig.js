// src/config/skinIssuesConfig.js
import blackheads from "../../assets/blackheads.jpg";
import whiteheads from "../../assets/whiteheads.jpg";
import acne from "../../assets/acne.jpg";
import pores from "../../assets/pores.webp";
import oil from "../../assets/oily.webp";
import redness from "../../assets/redness.webp";
import freckles from "../../assets/freckles.jpg";
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
  Oil: {
    image: oil,
    description:
      "Excess sebum production leading to shiny skin and potential breakouts.",
  },
  Redness: {
    image: redness,
    description: "Irritated or inflamed areas of skin causing visible redness.",
  },
  Freckles: {
    image: freckles,
    description:
      "Small, concentrated spots of melanin often triggered by sun exposure.",
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
