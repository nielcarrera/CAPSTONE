import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecommendationModal from "../components/RecommendationModal";
import { ANALYSIS_DATA } from "../Pages/utils/DummyData";
import { skinIssues } from "../Pages/utils/SkinIssueconfig";
import {
  enrichImpurities,
  getColorByValue,
} from "../Pages/utils/SkinAnalytics";

const ProductRecommendations = () => {
  // State for date selection
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || Object.keys(ANALYSIS_DATA)[0]
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // State for data loading
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [sortedImpurities, setSortedImpurities] = useState([]);

  // Modal state
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImpurity, setSelectedImpurity] = useState(null);

  // Database-ready function to fetch data (using dummy data temporarily)
  const fetchAnalysisData = async (date) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call:
      // const response = await fetch(`/api/analysis?date=${date}`);
      // const data = await response.json();

      // Using dummy data temporarily:
      const data =
        ANALYSIS_DATA[date] || ANALYSIS_DATA[Object.keys(ANALYSIS_DATA)[0]];

      setCurrentData(data);

      // Process the data
      const enriched = enrichImpurities(data.impurities, skinIssues);
      const sorted = [...enriched].sort((a, b) => b.value - a.value);
      setSortedImpurities(sorted);

      // Update URL with selected date
      setSearchParams({ date });
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      // Fallback to first available date if error occurs
      const firstDate = Object.keys(ANALYSIS_DATA)[0];
      setCurrentData(ANALYSIS_DATA[firstDate]);
      setSelectedDate(firstDate);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when date changes
  useEffect(() => {
    fetchAnalysisData(selectedDate);
  }, [selectedDate]);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDateDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-[240px] relative">
      <Sidebar />
      <Navbar />

      {/* Main Content Area */}
      <div className="mt-20 max-w-6xl mx-auto space-y-8">
        {/* Back Button and Date Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Date Selector */}
          <div className="relative bg-white rounded-lg shadow-sm border border-gray-300">
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 w-full md:w-64 justify-between"
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
                      onClick={() => handleDateSelect(date)}
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

        {/* Page Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Product Recommendations
              </h1>
              <p className="text-gray-600 mt-2">
                Personalized product suggestions based on your skin analysis
              </p>
            </div>
            {currentData && (
              <div className="mt-4 md:mt-0 text-sm text-gray-500">
                Last analyzed: {currentData.timestamp || "N/A"}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Product Recommendations */}
        {!isLoading && currentData && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="space-y-6">
              {sortedImpurities.length > 0 ? (
                sortedImpurities.map((impurity) => (
                  <motion.div
                    key={`${impurity.label}-${selectedDate}`} // Unique key with date
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="flex-shrink-0 w-full md:w-35 h-35 rounded-md overflow-hidden">
                        <img
                          src={impurity.image}
                          alt={impurity.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold mb-3 text-xl">
                              {impurity.label}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {impurity.description}
                            </p>
                          </div>
                          <span className="text-md font-lg mb-3 px-2 py-1 rounded">
                            {impurity.value}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="h-5 w-full bg-gray-300 rounded-sm overflow-hidden">
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
                          setSelectedImpurity({
                            ...impurity,
                            analysisDate: selectedDate, // Include date in selection
                          });
                          setShowDialog(true);
                        }}
                        className="px-6 py-3 bg-cyan-900 text-white rounded-lg hover:bg-gray-600 w-full md:w-auto"
                      >
                        Generate Product Recommendations
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No skin issues detected for this analysis date.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <RecommendationModal
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        impurity={selectedImpurity}
        analysisDate={selectedDate}
      />
    </div>
  );
};

export default ProductRecommendations;
