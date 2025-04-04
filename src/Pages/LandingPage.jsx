import React, { useState } from "react";
import { Share } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Mock data for the dashboard
const mockData = {
  firstName: "Dannjiro Pon-Chan",
  skinScore: 82,
  skinType: "Combination",
  faceProblems: {
    keyProblems: [
      { label: "Blackheads", value: 75, severity: "severe" },
      { label: "Oil", value: 60, severity: "moderate" },
      { label: "Acne", value: 40, severity: "mild" },
    ],
  },
  bodyProblems: {
    keyProblems: [], // No problems detected
  },
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
  recommendedProducts: [
    {
      id: 1,
      name: "Salicylic Acid Cleanser",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Niacinamide Serum",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Retinol Treatment",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      name: "Vitamin C Serum",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 5,
      name: "Hyaluronic Acid",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ],
};

const LandingPage = () => {
  const [userData] = useState(mockData); // Use dummy data directly
  const [showAnalytics, setShowAnalytics] = useState(true);

  const getSeverityColor = (severity) => {
    const colors = {
      mild: "bg-green-400",
      moderate: "bg-yellow-400",
      severe: "bg-red-400",
    };
    return colors[severity] || "bg-gray-300";
  };

  const getColorByValue = (value) => {
    if (value >= 75) return "#f87171"; // severe - red
    if (value >= 50) return "#facc15"; // moderate - yellow
    return "#4ade80"; // mild - green
  };

  const handleShare = () => {
    alert("Results shared successfully!");
  };

  return (
    <div className="min-h-screen p-4 ml-0 md:ml-[240px] mt-25">
      <Sidebar />
      <Navbar />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold animate-fade-in">
              Hello, <span className="text-cyan-800">{userData.firstName}</span>
            </h1>
          </div>
          <p
            className="text-gray-500 mt-1 animate-fade-in"
            style={{ animationDelay: "50ms" }}
          >
            Here's your skin analysis dashboard
          </p>
        </header>

        {/* Main Grid - Single column on mobile, two columns on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mt-2">
          {/* Row 1, Column 1 */}
          <div className="p-2 md:p-3">
            {/* Face Problems Card - Horizontal scroll on mobile */}
            <div
              className="mb-5 rounded-xl animate-scale-in border border-cyan-500"
              style={{
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
                animation: "scaleIn 0.2s ease-out forwards",
              }}
            >
              <div className="p-3 md:p-4 space-y-2">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recent Key Problems (Face)
                </h2>
                <div className="mt-4 overflow-x-auto hide-scrollbar">
                  <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 w-max md:w-full">
                    {userData.faceProblems.keyProblems.map((problem, index) => (
                      <div
                        key={problem.label}
                        className="space-y-1 animate-fade-in min-w-[120px] md:min-w-0"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-sm font-medium">
                          {problem.label}
                        </div>
                        <div className="h-3 w-full bg-gray-300 rounded-sm overflow-hidden">
                          <div
                            className={`${getSeverityColor(
                              problem.severity
                            )} h-full rounded-sm`}
                            style={{
                              width: `${problem.value}%`,
                              transition: "width 0.5s ease-out",
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {problem.value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Problems Card */}
            <div
              className="rounded-xl shadow-sm flex items-center justify-center border border-cyan-500 animate-scale-in"
              style={{
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
                animation: "scaleIn 0.2s ease-out forwards",
              }}
            >
              <div className="p-3 md:p-4 w-full">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-black">
                  Recent Key Problems (Body)
                </h2>
                <div className="flex flex-col items-center justify-center py-3 md:py-4 animate-fade-in">
                  <div className="text-base md:text-lg text-gray-400 font-medium">
                    No Impurity Detected
                  </div>
                  <div className="mt-1 md:mt-2 text-sm text-gray-700">
                    Your body skin appears to be clear
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 1, Column 2 */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-5 h-full overflow-hidden animate-scale-in">
            <div className="flex justify-center mb-1 md:mb-2">
              <h2 className="text-lg md:text-xl font-semibold text-white p-1 mb-2 md:mb-3">
                Recent Skin Issues Analytics (Face)
              </h2>
            </div>

            {showAnalytics && (
              <div className="flex space-x-2 animate-fade-in mt-3 md:mt-5 justify-center overflow-x-auto hide-scrollbar">
                {userData.analytics.map((issue, index) => (
                  <div
                    key={issue.label}
                    className="flex flex-col items-center space-y-1 md:space-y-2 text-cyan-500"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      width: "50px md:w-60px",
                      flexShrink: 0,
                    }}
                  >
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <div
                        className="text-xs md:text-sm font-medium text-center"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          marginRight: "3px md:5px",
                        }}
                      >
                        {issue.label}
                      </div>
                      <div className="relative w-5 md:w-7 h-[100px] md:min-h-50 bg-gray-700 rounded-md overflow-hidden flex">
                        <div
                          className="absolute bottom-0 w-full rounded-md"
                          style={{
                            backgroundColor: getColorByValue(issue.value),
                            height: `${issue.value}%`,
                            transition: "height 0.5s ease-out",
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs md:text-sm font-semibold ml-3 md:ml-5">
                      {issue.value}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 2, Column 1 */}
          <div className="gap-3 md:gap-4">
            {/* Skin Score Card */}
            <div
              className="bg-gray-800 rounded-xl pb-3 md:pb-5 shadow-sm overflow-hidden flex flex-col justify-between animate-scale-in"
              style={{
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
                animation: "scaleIn 0.2s ease-out forwards",
              }}
            >
              <div className="p-3 md:p-4">
                <h2 className="text-lg md:text-xl text-white font-semibold mb-3 md:mb-4">
                  Overall Skin Condition Score
                </h2>
                <div className="flex flex-col items-center justify-center py-1 md:py-2 animate-fade-in">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400">
                    {userData.skinScore}
                    <span className="text-lg md:text-xl text-gray-400 ml-1">
                      /100
                    </span>
                  </div>
                  <div className="mt-1 md:mt-2 text-sm text-gray-100">
                    {userData.skinScore >= 80
                      ? "Excellent"
                      : userData.skinScore >= 60
                      ? "Good"
                      : userData.skinScore >= 40
                      ? "Fair"
                      : "Needs Attention"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-5 md:mb-10">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center w-8/12 md:w-6/12 py-2 px-3 md:px-4 rounded-xl bg-blue-500 text-white font-medium hover:bg-opacity-90 transition-colors"
                >
                  <Share size={14} className="mr-1 md:mr-2" />
                  Share Results
                </button>
              </div>
            </div>

            {/* Skin Type Card */}
            <div
              className="rounded-xl shadow-sm my-1 md:my-2 overflow-hidden border border-cyan-500 animate-scale-in"
              style={{
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
                animation: "scaleIn 0.2s ease-out forwards",
              }}
            >
              <div className="p-3 md:p-4">
                <div className="flex flex-col items-center justify-center py-1 md:py-2 animate-fade-in">
                  <div className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Skintype:{" "}
                    <span className="text-cyan-800 text-3xl md:text-4xl font-bold">
                      {userData.skinType}
                    </span>
                  </div>
                  <div className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500 text-center">
                    {userData.skinType === "Dry"
                      ? "Your skin lacks oil and needs moisture."
                      : userData.skinType === "Oily"
                      ? "Your skin produces excess sebum."
                      : userData.skinType === "Combination"
                      ? "Your T-zone is oily, but cheeks are dry."
                      : userData.skinType === "Normal"
                      ? "Your skin is well-balanced."
                      : userData.skinType === "Sensitive"
                      ? "Your skin reacts easily to products."
                      : "Your skin type has unique characteristics."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2, Column 2 */}
          <div
            className="rounded-xl shadow-sm border border-cyan-500 animate-scale-in"
            style={{
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
              animation: "scaleIn 0.2s ease-out forwards",
            }}
          >
            <div className="p-4 md:p-6">
              {/* Header with "See More" button */}
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recently Recommended Products
                </h2>
                <button
                  onClick={() => console.log("See More clicked")}
                  className="text-xs md:text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  See More
                </button>
              </div>

              {/* Horizontal Scrollable Cards */}
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex space-x-3 pb-2 w-max">
                  {userData.recommendedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex-none w-28 md:w-36 rounded-lg overflow-hidden border border-cyan-500 transition-transform hover:transform hover:-translate-y-1 hover:shadow-lg"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="h-28 md:h-36 w-full bg-gray-200 relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-1 md:p-2">
                        <h3 className="text-xs md:text-sm font-medium truncate">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-[10px] md:text-xs text-gray-500">
                            Recommended
                          </span>
                          <span className="text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 bg-blue-500 text-white rounded-full">
                            New
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
