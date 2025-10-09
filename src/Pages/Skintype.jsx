import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { skinTypes } from "../Pages/utils/SkintypesData";
import {
  fetchUserSkinType,
  saveUserSkinType,
  getSkinTypeDetails,
} from "../service/skintypeService";
import { supabase } from "../lib/supabaseClient";

const ST = () => {
  const navigate = useNavigate();
  const [currentSkinType, setCurrentSkinType] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(skinTypes[0].id);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get the current user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate("/login");
          return;
        }

        // Fetch the user's skin type from database
        const skinTypeRecord = await fetchUserSkinType(user.id);

        if (skinTypeRecord) {
          // Get full details from local data
          const details = getSkinTypeDetails(
            skinTypeRecord.skintype,
            skinTypeRecord.created_at
          );

          setCurrentSkinType(details);
          setSelectedType(skinTypeRecord.skintype);
        }
      } catch (error) {
        console.error("Error loading skin type:", error);
        setError("Failed to load skin type data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSkinTypeChange = async () => {
    if (!selectedType) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Save to database
      const updatedRecord = await saveUserSkinType(user.id, selectedType);

      // Get full details from local data
      const details = getSkinTypeDetails(
        selectedType,
        updatedRecord.created_at
      );

      setCurrentSkinType(details);
      setShowDialog(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowDialog(false), 3000);
    } catch (error) {
      console.error("Error saving skin type:", error);
      setError("Failed to save skin type. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const noSkinType = !currentSkinType && !isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen ml-50 bg-gray-100 flex items-center justify-center">
        <Sidebar />
        <div className="text-center">Loading your skin type information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  ml-50 bg-gray-100">
      <Sidebar />
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Success Dialog */}
          {showDialog && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-20 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              Skin type updated successfully!
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          {/* Mobile App Promotion */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-cyan-800 to-gray-800 py-7 px-20 rounded-2xl shadow-sm border border-purple-200 cursor-pointer"
            onClick={() => navigate("/download")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-300">
                  Identify Your Skin Type
                </h3>
                <p className="text-gray-300">
                  Use our mobile app for real-time skin analysis with your
                  phone's camera
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>

          {/* Skin Type Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {noSkinType
                    ? "Select Your Skin Type"
                    : "Change Your Skin Type"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {noSkinType
                    ? "No skin type detected yet. Please select your skin type below."
                    : "Select your current skin type below"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={isLoading}
                >
                  {skinTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkinTypeChange}
                  disabled={
                    isLoading ||
                    (currentSkinType && selectedType === currentSkinType.id)
                  }
                  className={`px-4 py-2 rounded-lg ${
                    isLoading ||
                    (currentSkinType && selectedType === currentSkinType.id)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-cyan-700 hover:bg-cyan-800 text-white"
                  }`}
                >
                  {isLoading
                    ? "Saving..."
                    : noSkinType
                    ? "Save Skin Type"
                    : "Save Changes"}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Skin Type Details */}
          {currentSkinType ? (
            <SkinTypeDetails skinType={currentSkinType} navigate={navigate} />
          ) : (
            <NoSkinTypeDetected />
          )}
        </motion.div>
      </main>
    </div>
  );
};

const SkinTypeDetails = ({ skinType, navigate }) => (
  <>
    <div className="text-center mt-15 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">
        Your Skin Type is:{" "}
        <span className="text-purple-600">{skinType.type}</span>
      </h2>
      {skinType.lastChecked && (
        <p className="text-gray-600 max-w-2xl mx-auto">
          Last checked: {new Date(skinType.lastChecked).toLocaleDateString()}
        </p>
      )}
      <p className="text-gray-600 max-w-2xl mx-auto">{skinType.description}</p>
    </div>

    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-6">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {skinType.imageUrl?.length > 0 && (
              <img
                src={skinType.imageUrl[0]}
                alt={`${skinType.type} skin type`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <SkinTypeSection
            title="Key Characteristics"
            items={skinType.characteristics}
            color="purple"
          />
          <SkinTypeSection
            title="Causes"
            items={skinType.causes}
            color="pink"
          />
          <SkinTypeSection
            title="General Tips"
            items={skinType.generaltips}
            color="pink"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-10 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/routine")}
          className="flex-1 px-3 py-5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          Build Your Routine
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/download")}
          className="flex-1 px-3 py-5 bg-cyan-800 text-white rounded-xl hover:bg-cyan-700 transition-colors"
        >
          Track Skin Impurity
        </motion.button>
      </div>
    </div>
  </>
);

const SkinTypeSection = ({ title, items, color = "purple" }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 text-gray-600"
        >
          <div className={`w-2 h-2 bg-${color}-300 rounded-full`} />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  </div>
);

const NoSkinTypeDetected = () => (
  <div className="text-center space-y-6 mt-12">
    <h2 className="text-2xl font-semibold text-gray-900">
      No Skin Type Detected Yet
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Please select your skin type above and click "Save Skin Type" to continue.
    </p>
  </div>
);

export default ST;
