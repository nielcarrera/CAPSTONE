import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Edit } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecommendationModal from "../components/RecommendationModal";
import { ANALYSIS_DATA } from "../Pages/utils/DummyData";
import { skinIssues } from "../Pages/utils/SkinIssueconfig";
import {
  enrichImpurities,
  getColorByValue,
} from "../Pages/utils/SkinAnalytics";

// Mock user data (would come from your auth/context in real app)
const MOCK_USER_DATA = {
  firstName: "Dannjiro Pon-Chan",
  skinType: "Combination",
};

const skinTypes = ["Normal", "Dry", "Oily", "Combination", "Sensitive"];

const ProductRecommendations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || Object.keys(ANALYSIS_DATA)[0]
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [sortedImpurities, setSortedImpurities] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImpurity, setSelectedImpurity] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingSkinType, setIsEditingSkinType] = useState(false);
  const [userData, setUserData] = useState(MOCK_USER_DATA);

  const fetchAnalysisData = async (date) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data =
        ANALYSIS_DATA[date] || ANALYSIS_DATA[Object.keys(ANALYSIS_DATA)[0]];
      setCurrentData(data);
      const enriched = enrichImpurities(data.impurities, skinIssues);
      setSortedImpurities([...enriched].sort((a, b) => b.value - a.value));
    } catch (error) {
      console.error("Error:", error);
      const firstDate = Object.keys(ANALYSIS_DATA)[0];
      setCurrentData(ANALYSIS_DATA[firstDate]);
      setSelectedDate(firstDate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSkinType = (newType) => {
    setUserData((prev) => ({ ...prev, skinType: newType }));
    setIsEditingSkinType(false);
    // In a real app, you would save to your backend here
    // await updateUserProfile({ skinType: newType });
  };

  const handleGenerateRecommendations = async (impurity) => {
    setIsGenerating(true);
    try {
      // This is where you would call your model API
      // const response = await fetch('/api/generate-recommendations', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     impurity: impurity.label,
      //     severity: impurity.value,
      //     skinType: userData.skinType,
      //     date: selectedDate
      //   })
      // });
      // const recommendations = await response.json();

      // Simulate API call delay (2-5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Navigate to results page with the generated data
      navigate("/recommendations/results", {
        state: {
          recommendations: generateMockRecommendations(impurity),
          impurity,
          skinType: userData.skinType,
          date: selectedDate,
        },
      });
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate recommendations. Please try again.");
    } finally {
      setIsGenerating(false);
      setShowDialog(false);
    }
  };

  // Helper function for mock data (remove in production)
  const generateMockRecommendations = (impurity) => {
    const products = [
      { name: "Cleansing Gel", brand: "CeraVe", type: "cleanser" },
      { name: "Hydrating Toner", brand: "Paula's Choice", type: "toner" },
      { name: "Treatment Serum", brand: "The Ordinary", type: "serum" },
    ];
    return {
      routine: products,
      explanation: `These products help address ${
        impurity.label
      } for ${userData.skinType.toLowerCase()} skin by ${impurity.description.toLowerCase()}`,
    };
  };

  useEffect(() => {
    fetchAnalysisData(selectedDate);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:ml-[240px] relative">
      <Sidebar />
      <Navbar />

      <div className="mt-20 max-w-6xl mx-auto space-y-8 px-4">
        {/* User Profile Header with Skin Type */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Product Recommendations
              </h1>
              <p className="text-gray-600 mt-2">
                Personalized suggestions based on your skin analysis
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isEditingSkinType ? (
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <span className="text-lg font-medium">Skin Type:</span>
                  <span className="ml-2 text-xl text-cyan-800 font-semibold">
                    {userData.skinType}
                  </span>
                  <button
                    onClick={() => setIsEditingSkinType(true)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={userData.skinType}
                    onChange={(e) => handleUpdateSkinType(e.target.value)}
                    className="bg-gray-100 text-lg rounded-full px-4 py-2 appearance-none"
                  >
                    {skinTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsEditingSkinType(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 w-full justify-between bg-white rounded-lg shadow-sm border border-gray-300"
              disabled={isLoading}
            >
              <span>{selectedDate}</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  isDateDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDateDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200"
                >
                  {Object.keys(ANALYSIS_DATA).map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setIsDateDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        date === selectedDate
                          ? "text-violet-600 font-medium"
                          : ""
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Recommendations List */
          <div className="bg-white p-6 rounded-xl shadow-sm">
            {sortedImpurities.length > 0 ? (
              <div className="space-y-6">
                {sortedImpurities.map((impurity) => (
                  <motion.div
                    key={`${impurity.label}-${selectedDate}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="w-full md:w-38 h-40 rounded-md mr-5  overflow-hidden flex-shrink-0">
                        <img
                          src={impurity.image}
                          alt={impurity.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold text-lg md:text-xl">
                              {impurity.label}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {impurity.description}
                            </p>
                          </div>
                          <span className="text-lg font-medium mt-2 md:mt-0">
                            {impurity.value}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="h-5 w-full mt-5 bg-gray-200 rounded-sm overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${impurity.value}%` }}
                              className="h-full rounded-md"
                              style={{
                                backgroundColor: getColorByValue(
                                  impurity.value
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedImpurity(impurity);
                          setShowDialog(true);
                        }}
                        className="px-6 py-2 bg-cyan-900 text-white rounded-lg hover:bg-cyan-800 transition-colors"
                      >
                        Generate Recommendations
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No skin issues detected for this analysis date.
              </div>
            )}
          </div>
        )}
      </div>

      <RecommendationModal
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        impurity={selectedImpurity}
        onGenerate={handleGenerateRecommendations}
        isGenerating={isGenerating}
        skinType={userData.skinType}
      />
    </div>
  );
};

export default ProductRecommendations;
