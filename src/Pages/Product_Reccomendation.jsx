import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { X } from "lucide-react";
import { motion } from "framer-motion";

// Sample product data based on different impurities
const productDatabase = {
  Whiteheads: {
    name: "ClearPore Salicylic Acid Cleanser",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    description:
      "Deep-cleaning facial wash that helps unclog pores and prevent whiteheads.",
    instructions: [
      "Use twice daily, morning and evening",
      "Apply to damp skin and massage gently",
      "Rinse thoroughly with lukewarm water",
      "Follow with a non-comedogenic moisturizer",
    ],
    price: "$24.99",
  },
  Blackheads: {
    name: "PoreVacuum Clay Mask",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    description:
      "Detoxifying mask that draws out impurities and reduces the appearance of blackheads.",
    instructions: [
      "Apply to clean skin 1-2 times weekly",
      "Leave on for 10-15 minutes until dry",
      "Rinse off with warm water using circular motions",
      "Follow with toner and moisturizer",
    ],
    price: "$32.95",
  },
  Pores: {
    name: "Pore Minimizing Serum",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    description:
      "Advanced formula that visibly reduces pore size and refines skin texture.",
    instructions: [
      "Apply to clean skin morning and evening",
      "Use 2-3 drops for entire face",
      "Gently pat into skin until absorbed",
      "Follow with moisturizer and sunscreen (AM)",
    ],
    price: "$45.00",
  },
  Acne: {
    name: "ClearSkin Spot Treatment",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    description:
      "Fast-acting formula targets individual blemishes and reduces redness.",
    instructions: [
      "Apply directly to blemishes with clean fingertip",
      "Use morning and evening after cleansing",
      "Let dry completely before applying other products",
      "Can be used up to 3 times daily on stubborn spots",
    ],
    price: "$19.99",
  },
  Redness: {
    name: "Calming Green Tea Moisturizer",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    description:
      "Soothing moisturizer that reduces redness and calms irritated skin.",
    instructions: [
      "Apply to clean face twice daily",
      "Use gentle patting motions to avoid further irritation",
      "Can be refrigerated for additional soothing effect",
      "Ideal for sensitive and reactive skin types",
    ],
    price: "$28.95",
  },
  Oil: {
    name: "Oil Control Mattifying Gel",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    description:
      "Lightweight gel that controls excess oil and provides a matte finish all day.",
    instructions: [
      "Apply to clean skin in the morning",
      "Focus on T-zone and other oily areas",
      "Can be used under makeup or alone",
      "Reapply midday if needed on especially oily areas",
    ],
    price: "$26.50",
  },
  Wrinkles: {
    name: "Age-Defying Peptide Cream",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    description:
      "Rich cream that reduces fine lines and prevents premature aging.",
    instructions: [
      "Apply to clean face and neck every night",
      "Use upward motions when applying",
      "Focus extra product on areas with visible lines",
      "Follow with facial oil if extra hydration is needed",
    ],
    price: "$64.00",
  },
  Freckles: {
    name: "Even Tone Brightening Serum",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    description:
      "Illuminating serum that evens skin tone and reduces the appearance of dark spots.",
    instructions: [
      "Apply to clean skin morning and evening",
      "Avoid eye area when applying",
      "Always use sunscreen during daytime",
      "Results visible after 4-6 weeks of consistent use",
    ],
    price: "$52.95",
  },
};

// Impurity data with images for illustration
const impurities = [
  {
    label: "Whiteheads",
    value: 80,
    severity: "severe",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
  },
  {
    label: "Pores",
    value: 65,
    severity: "moderate",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    label: "Redness",
    value: 50,
    severity: "mild",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
  },
  {
    label: "Wrinkles",
    value: 30,
    severity: "mild",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    label: "Blackheads",
    value: 50,
    severity: "moderate",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
  },
  {
    label: "Acne",
    value: 35,
    severity: "mild",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    label: "Oil",
    value: 35,
    severity: "mild",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
  },
  {
    label: "Freckles",
    value: 35,
    severity: "mild",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
  },
];

const ProductRecommendation = () => {
  const [selectedImpurity, setSelectedImpurity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "severe":
        return "bg-red-500";
      case "moderate":
        return "bg-orange-500";
      case "mild":
        return "bg-green-500";
      default:
        return "bg-violet-500";
    }
  };

  const handleGenerateProduct = (impurity) => {
    setSelectedImpurity(impurity);
    setLoading(true);
    setShowModal(true);

    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />

      <div className="md:ml-[280px] pt-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 my-6">
            Product Recommendations
          </h1>
          <p className="text-gray-600 mb-8">
            Based on your scan results, we've identified the following skin
            issues. Click "Generate Product" to see personalized recommendations
            for each concern.
          </p>

          {/* Impurities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {impurities.map((impurity) => (
              <div
                key={impurity.label}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-40 bg-gray-100 relative">
                  <img
                    src={impurity.image}
                    alt={impurity.label}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-2 right-2 h-3 w-3 rounded-full ${getSeverityColor(
                      impurity.severity
                    )}`}
                  ></div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {impurity.label}
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      {impurity.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
                    <div
                      className={`h-2 rounded-full ${getSeverityColor(
                        impurity.severity
                      )}`}
                      style={{ width: `${impurity.value}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => handleGenerateProduct(impurity)}
                    className="w-full py-2 bg-[#1A1F2C] text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Generate Product
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Severity Legend */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Severity Legend:
            </h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Severe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Mild</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Recommendation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {selectedImpurity?.label} Treatment
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-10 h-10 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">
                    Finding the perfect product for you...
                  </p>
                </div>
              ) : (
                <div className="product-recommendation">
                  {selectedImpurity &&
                    productDatabase[selectedImpurity.label] && (
                      <>
                        <div className="mb-4 bg-gray-100 p-4 rounded-lg flex justify-center">
                          <img
                            src={productDatabase[selectedImpurity.label].image}
                            alt={productDatabase[selectedImpurity.label].name}
                            className="h-40 object-contain"
                          />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {productDatabase[selectedImpurity.label].name}
                        </h3>

                        <p className="text-gray-600 mb-4">
                          {productDatabase[selectedImpurity.label].description}
                        </p>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">
                            How to use:
                          </h4>
                          <ul className="space-y-1">
                            {productDatabase[
                              selectedImpurity.label
                            ].instructions.map((instruction, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <span className="text-[#8B5CF6] font-bold">
                                  •
                                </span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-[#8B5CF6]">
                            {productDatabase[selectedImpurity.label].price}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 4 ? "text-yellow-400" : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>

                        <button className="w-full py-2 bg-[#8B5CF6] text-white rounded-md hover:bg-[#7c3aed] transition-colors">
                          Save Product
                        </button>
                      </>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendation;
