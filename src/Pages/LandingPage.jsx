// src/pages/LandingPage.jsx

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// service functions (note: lowercase “landingpageService” to match file on disk)
import {
  fetchUserDetails,
  fetchUserSkinType,
  fetchRecentProducts,
  fetchRecentFaceKeyProblems,
  fetchRecentFaceAnalytics,
  fetchRecentBodyKeyProblems,
  fetchRecentBodyImpurities,
} from "../service/landingpageService";

// Dashboard’s loader & shared scorer
import { loadAnalysisData } from "../service/analysisDataService";
import { computeSkinScore } from "../Pages/utils/SkinAnalytics";

const ALL_IMPURITIES = [
  "Whiteheads",
  "Pores",
  "Redness",
  "Acne",
  "Blackheads",
  "Wrinkles",
  "Dark Circles",
];

const LandingPage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    skinType: null,
    faceKeyProblems: [],
    faceAnalytics: [],
    faceScore: 0,
    bodyKeyProblems: [],
    bodyScore: 0,
  });
  const [bodyImpurities, setBodyImpurities] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }
        const userId = user.id;

        // 1) Profile
        const userDetails = await fetchUserDetails(userId);
        const userSkinType = await fetchUserSkinType(userId);

        // 2) Mirror Dashboard’s loader + scorer exactly
        const allAnalysis = await loadAnalysisData(userId);
        const dates = Object.keys(allAnalysis).sort((a, b) =>
          b.localeCompare(a)
        );
        const latestDate = dates[0];
        console.log("🚩 LandingPage dates:", dates, "→ using", latestDate);

        const faceImpurities = allAnalysis[latestDate]?.impurities || [];
        const faceScore = computeSkinScore(faceImpurities);

        // 3) But still use your helpers for keyProblems + analytics
        const [faceKeyProblems, faceAnalytics] = await Promise.all([
          fetchRecentFaceKeyProblems(userId),
          fetchRecentFaceAnalytics(userId),
        ]);

        // 4) Body keyProblems + score
        const [bodyKeyProblems, bodyScore] = await Promise.all([
          fetchRecentBodyKeyProblems(userId),
        ]);

        // 5) Body‐impurity cards
        const recentBodies = await fetchRecentBodyImpurities(userId, 3);

        // 6) Saved products
        const products = await fetchRecentProducts(userId, 3);

        // 7) Update state
        setUserData({
          firstName: userDetails?.first_name || "User",
          skinType: userSkinType || null,
          faceKeyProblems,
          faceAnalytics,
          faceScore,
          bodyKeyProblems,
          bodyScore,
        });

        setBodyImpurities(recentBodies);
        setRecentProducts(products);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 ml-0 md:ml-[240px] mt-25 flex items-center justify-center">
        <div className="text-lg">Loading your skin analysis...</div>
      </div>
    );
  }

  if (!userData.firstName) {
    return (
      <div className="min-h-screen p-4 ml-0 md:ml-[240px] mt-25 flex items-center justify-center">
        <div className="text-lg text-red-500">Failed to load skin data</div>
      </div>
    );
  }

  const handleSeeMore = () => navigate("/product");
  const analyticsMap = new Map(
    userData.faceAnalytics.map((item) => [item.label, item.value])
  );

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

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mt-2">
          {/* Col 1: Face Key Problems & Body Impurities */}
          <div className="p-2 md:p-3">
            {/* Face Key Problems */}
            <div
              className="mb-5 rounded-xl animate-scale-in border border-cyan-500"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
            >
              <div className="p-3 md:p-4 space-y-2">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recent Key Problems (Face)
                </h2>
                <div className="mt-4 overflow-x-auto hide-scrollbar">
                  <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 w-max md:w-full">
                    {userData.faceKeyProblems.length > 0 ? (
                      userData.faceKeyProblems.map((problem, i) => (
                        <div
                          key={problem.label}
                          className="space-y-1 animate-fade-in min-w-[120px] md:min-w-0"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <div className="text-sm font-medium">
                            {problem.label}
                          </div>
                          <div className="h-3 w-full bg-gray-300 rounded-sm overflow-hidden">
                            <div
                              className={`h-full rounded-sm ${
                                problem.severity === "severe"
                                  ? "bg-red-400"
                                  : problem.severity === "moderate"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                              }`}
                              style={{ width: `${problem.value}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {problem.value}%
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">
                        No face issues detected.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Impurity Cards */}
            <div
              className="rounded-xl shadow-sm border border-cyan-500 animate-scale-in"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
            >
              <div className="p-5 md:p-4">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-black">
                  Recent Body Impurities
                </h2>
                {bodyImpurities.length > 0 ? (
                  <div
                    className={`grid ${
                      bodyImpurities.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    } gap-4`}
                  >
                    {bodyImpurities.map((imp, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="p-4">
                          <h3 className="text-md font-bold text-gray-900">
                            {imp.label}
                          </h3>
                          <div className="mt-2 text-xs text-gray-500">
                            Detected:{" "}
                            {new Date(imp.detected_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 md:py-10 animate-fade-in">
                    <div className="text-base md:text-lg text-gray-400 font-medium">
                      No impurity detected
                    </div>
                    <div className="mt-1 md:mt-2 text-sm text-gray-700">
                      Your body skin appears to be clear
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Face Analytics */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 animate-scale-in">
            <h2 className="text-white text-center text-lg font-semibold mb-5">
              Skin Issues Analytics (Face)
            </h2>
            <div className="space-y-3 px-2">
              {ALL_IMPURITIES.map((imp, i) => {
                const value = analyticsMap.get(imp) || 0;
                return (
                  <div
                    key={i}
                    className="flex items-center"
                    style={{ minHeight: "30px" }}
                  >
                    <div className="w-24 text-sm font-light text-gray-200">
                      {imp}
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-md h-6 ml-4 relative overflow-hidden">
                      <div
                        className="h-full rounded-md"
                        style={{
                          width: `${value}%`,
                          backgroundColor:
                            value >= 75
                              ? "#f87171"
                              : value >= 50
                              ? "#facc15"
                              : "#4ade80",
                        }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-gray-100 ml-4">
                      {value}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: Face Score & Skin Type */}
          <div className="gap-3 md:gap-4">
            {/* Face Score */}
            <div
              className="bg-gray-800 rounded-xl pb-3 md:pb-5 shadow-sm overflow-hidden flex flex-col justify-between animate-scale-in"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
            >
              <div className="p-3 md:p-4">
                <h2 className="text-lg md:text-xl text-white font-semibold mb-3 md:mb-4">
                  Recent Skin Condition Score (Face)
                </h2>
                <div className="flex flex-col items-center justify-center py-1 md:py-2 animate-fade-in">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400">
                    {userData.faceScore}
                    <span className="text-lg md:text-xl text-gray-400 ml-1">
                      /100
                    </span>
                  </div>
                  <div className="mt-1 md:mt-2 text-sm text-gray-100">
                    {userData.faceScore >= 80
                      ? "Excellent"
                      : userData.faceScore >= 60
                      ? "Good"
                      : userData.faceScore >= 40
                      ? "Fair"
                      : "Needs Attention"}
                  </div>
                </div>
              </div>
            </div>

            {/* Skin Type */}
            <div
              className="rounded-xl shadow-sm my-1 md:my-2 overflow-hidden border border-cyan-500 animate-scale-in"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
            >
              <div className="p-3 md:p-4">
                <div className="flex flex-col items-center justify-center py-1 md:py-2 animate-fade-in">
                  <div className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Skintype:{" "}
                    <span className="text-cyan-800 text-3xl md:text-4xl font-bold">
                      {userData.skinType || "N/A"}
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
                      : "Please set your skin type on the My Skintype Page."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Recently Saved Products */}
          <div
            className="rounded-xl shadow-sm border border-cyan-500 animate-scale-in flex flex-col justify-between"
            style={{
              height: "100%",
              minHeight: "170px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            <div className="p-4 md:p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recently Saved Products
                </h2>
                {recentProducts.length > 0 && (
                  <button
                    onClick={handleSeeMore}
                    className="text-xs md:text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    See More
                  </button>
                )}
              </div>
              {recentProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 h-full">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="h-[220px] rounded-lg overflow-hidden border border-gray-200 transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col"
                    >
                      <div className="h-[85%] w-full bg-gray-200 relative overflow-hidden">
                        <img
                          src={product.product_details?.image}
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
                        <span className="text-[12px] text-gray-500">
                          {product.product_details?.area || "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-gray-500 text-center">
                    No products found
                  </div>
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
