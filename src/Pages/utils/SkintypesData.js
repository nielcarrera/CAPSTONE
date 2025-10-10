// src/data/skinTypesData.js
import normal from "../../assets/normalskin.jpg";
import dry from "../../assets/dryskin.jpg";
import oily from "../../assets/oilyskin.jpg";
import sensitive from "../../assets/sensitiveskin.jpg";

export const skinTypes = [
  {
    id: "Oily",
    type: "Oily",
    description:
      "Oily skin produces excess sebum, leading to a shiny appearance, enlarged pores, and a tendency toward acne and blackheads. This skin type benefits from oil-control products and regular cleansing.",
    imageUrl: [oily],
    characteristics: [
      "Shiny, greasy appearance",
      "Enlarged pores",
      "Prone to acne and breakouts",
      "Makeup doesn't stay in place",
    ],
    causes: [
      "Overactive sebaceous glands",
      "Hormonal factors",
      "Genetics",
      "Humidity and hot weather",
    ],
    generaltips: [
      "Use oil-free, non-comedogenic products",
      "Wash face twice daily with a gentle cleanser",
      "Use blotting papers throughout the day",
    ],
  },
  {
    id: "Dry",
    type: "Dry",
    description:
      "Dry skin lacks sufficient natural oils, often feeling tight and rough. It may show more visible lines and can be prone to flaking, redness, and irritation. Requires rich moisturizers and gentle care.",
    imageUrl: [dry],
    characteristics: [
      "Tight feeling, especially after cleansing",
      "Rough texture",
      "Visible flaking or peeling",
      "More visible fine lines",
    ],
    causes: [
      "Aging (decreased oil production)",
      "Cold or dry weather",
      "Harsh soaps and hot water",
      "Certain medical conditions",
    ],
    generaltips: [
      "Use creamy, fragrance-free cleansers",
      "Apply moisturizer immediately after bathing",
      "Avoid long, hot showers",
      "Consider a humidifier in dry climates",
    ],
  },
  {
    id: "Normal",
    type: "Normal",
    description:
      "Normal skin is well-balanced, not too oily nor too dry. It has a smooth texture, small pores, and few imperfections. This skin type requires maintenance of its natural balance with gentle products.",
    imageUrl: [normal],
    characteristics: [
      "Neither too oily nor too dry",
      "Small, barely visible pores",
      "Few blemishes or breakouts",
      "Good blood circulation",
    ],
    causes: [
      "Genetic predisposition",
      "Proper skin care routine",
      "Healthy lifestyle factors",
    ],
    generaltips: [
      "Maintain with gentle cleansing and moisturizing",
      "Use sunscreen daily",
      "Stay hydrated and eat a balanced diet",
    ],
  },
  {
    id: "Sensitive",
    type: "Sensitive",
    description:
      "Sensitive skin reacts easily to products, environmental factors, or stress, often with redness, itching, or burning. Requires hypoallergenic, fragrance-free products and gentle care.",
    imageUrl: [sensitive],
    characteristics: [
      "Easily irritated",
      "Frequent redness",
      "Burning or stinging sensation",
      "Dryness and itching",
    ],
    causes: [
      "Thin or compromised skin barrier",
      "Environmental factors",
      "Allergies or skin conditions",
      "Overuse of harsh products",
    ],
    generaltips: [
      "Use fragrance-free, hypoallergenic products",
      "Patch test new products",
      "Avoid extreme temperatures",
      "Choose products with soothing ingredients",
    ],
  },
];
