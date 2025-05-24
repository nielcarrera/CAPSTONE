import React, { useState, useEffect } from "react";
import { Share } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { ANALYSIS_DATA, mockUser } from "../Pages/utils/DummyData";
import { getRecommendedProducts, products } from "../Pages/utils/Productdata";

// Helper functions
const getSeverityColor = (severity) => {
  const colors = {
    mild: "bg-green-400",
    moderate: "bg-yellow-400",
    severe: "bg-red-400",
  };
  return colors[severity] || "bg-gray-300";
};

const getColorByValue = (value) => {
  if (value >= 75) return "#f87171";
  if (value >= 50) return "#facc15";
  return "#4ade80";
};

// Calculate skin score based on analytics data
const calculateSkinScore = (analytics) => {
  if (!analytics || analytics.length === 0) return 0;

  // Calculate average of all values, then invert (higher problems = lower score)
  const total = analytics.reduce((sum, item) => sum + item.value, 0);
  const average = total / analytics.length;

  // Convert to score out of 100 (higher is better)
  return Math.round(100 - average);
};

// Get top 3 problems from analytics
const getTopProblems = (analytics) => {
  if (!analytics) return [];

  // Sort by value descending and take top 3
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

const LandingPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const mostRecentKey = Object.keys(ANALYSIS_DATA)[0]; // You can sort to ensure latest
        const mostRecent = ANALYSIS_DATA[mostRecentKey];

        const skinScore = calculateSkinScore(mostRecent.analytics);
        const topProblems = getTopProblems(mostRecent.analytics);

        setUserData({
          ...mockUser,
          skinScore,
          faceProblems: { keyProblems: topProblems },
          bodyProblems: { keyProblems: [] },
          analytics: mostRecent.analytics,
        });

        setRecommendedProducts(getRecommendedProducts());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleShare = () => {
    alert("Results shared successfully!");
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: "New Product",
      brand: "Test Brand",
      image: "https://via.placeholder.com/150",
    };
    setRecommendedProducts((prev) => [...prev, newProduct]);
  };

  const handleSeeMore = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 ml-0 md:ml-[240px] mt-25 flex items-center justify-center">
        <div className="text-lg">Loading your skin analysis...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen p-4 ml-0 md:ml-[240px] mt-25 flex items-center justify-center">
        <div className="text-lg text-red-500">Failed to load skin data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 ml-0 md:ml-[240px] mt-25">
      <Sidebar />
      <Navbar />

      <div className="max-w-6xl mx-auto">
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

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mt-2">
          {/* Column 1 */}
          <div className="p-2 md:p-3">
            <div
              className="mb-5 rounded-xl animate-scale-in border border-cyan-500"
              style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)" }}
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
                            style={{ width: `${problem.value}%` }}
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

            <div
              className="rounded-xl shadow-sm flex items-center justify-center border border-cyan-500 animate-scale-in"
              style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)" }}
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

          {/* Column 2 */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-5 h-full overflow-hidden animate-scale-in">
            <div className="flex justify-center mb-1 md:mb-2">
              <h2 className="text-lg md:text-xl font-semibold text-white p-1 mb-2 md:mb-3">
                Recent Skin Issues Analytics (Face)
              </h2>
            </div>
            <div className="flex space-x-4 animate-fade-in mt-3 md:mt-5 justify-center overflow-x-auto hide-scrollbar">
              {userData.analytics.map((issue, index) => (
                <div
                  key={issue.label}
                  className="flex flex-col items-center space-y-3 md:space-y-2 text-cyan-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    width: "50px md:w-60px",
                    flexShrink: 0,
                  }}
                >
                  <div className="flex items-center space-x-3 md:space-x-2">
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
                    <div className="relative w-5 md:w-8 h-[100px] md:min-h-70 bg-gray-700 rounded-md overflow-hidden flex">
                      <div
                        className="absolute bottom-0 w-full rounded-md"
                        style={{
                          backgroundColor: getColorByValue(issue.value),
                          height: `${issue.value}%`,
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
          </div>

          {/* Column 3 */}
          <div className="gap-3 md:gap-4">
            <div
              className="bg-gray-800 rounded-xl pb-3 md:pb-5 shadow-sm overflow-hidden flex flex-col justify-between animate-scale-in"
              style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)" }}
            >
              <div className="p-3 md:p-4">
                <h2 className="text-lg md:text-xl text-white font-semibold mb-3 md:mb-4">
                  Recent Skin Condition Score
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

            <div
              className="rounded-xl shadow-sm my-1 md:my-2 overflow-hidden border border-cyan-500 animate-scale-in"
              style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)" }}
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

          {/* Column 4 */}
          <div
            className="rounded-xl shadow-sm border border-cyan-500 animate-scale-in flex flex-col justify-between"
            style={{
              height: "100%",
              minHeight: "270px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="p-4 md:p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recently Saved Products
                </h2>
                {recommendedProducts.length > 0 && (
                  <button
                    onClick={handleSeeMore}
                    className="text-xs md:text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    See More
                  </button>
                )}
              </div>

              {recommendedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-gray-500 mb-4 text-center">
                    No products saved yet
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl">+</span>
                      <div className="text-xs mt-1">Add Product</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-full">
                  {recommendedProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="h-36 md:h-40 rounded-lg overflow-hidden border border-gray-200 transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col"
                    >
                      <div className="h-[60%] w-full bg-gray-200 relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-2 h-[40%] flex flex-col justify-between">
                        <h3 className="text-xs font-medium truncate">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-500">
                            {product.brand}
                          </span>
                          <span className="text-[10px] px-1 py-0.5 bg-blue-500 text-white rounded-full">
                            New
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {Array.from({
                    length: 6 - Math.min(recommendedProducts.length, 6),
                  }).map((_, index) => (
                    <button
                      key={`add-${index}`}
                      onClick={handleAddProduct}
                      className="flex items-center justify-center h-36 md:h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      <div className="text-center">
                        <span className="text-2xl">+</span>
                        <div className="text-xs mt-1">Add Product</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
