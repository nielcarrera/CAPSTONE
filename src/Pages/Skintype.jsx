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
import dark from "../assets/dark.jpg";
import light from "../assets/light.jpg";
import fair from "../assets/fair.jpg";

// Dummy data for skin tones
const skinTones = [
  {
    id: "fair",
    type: "Fair",
    description:
      "Fair skin has very little melanin. It tends to burn easily under sunlight and may show redness or irritation quickly. This tone benefits from barrier-strengthening and calming products.",
    characteristics: [
      "Very sensitive to UV rays and heat",
      "Burns easily, rarely tans",
      "More prone to redness, irritation, and rosacea-like symptoms",
      "Fine lines and wrinkles may appear earlier due to thinner skin barrier",
    ],
    focus: [
      "High SPF protection (SPF 50+ daily)",
      "Gentle ingredients: avoid strong acids or retinoids layered together",
      "Hydrating and barrier repair products (with ceramides, niacinamide)",
      "Soothing actives like aloe, centella, and panthenol",
    ],
    cautions: [
      "Avoid over-exfoliation (limit AHAs/BHAs to 1–2x weekly)",
      "Test actives (like vitamin C or retinol) before use — irritation risk is high",
    ],
    imageUrl: fair,
  },
  {
    id: "light",
    type: "Light",
    description:
      "Light skin has a moderate melanin level. It may tan slightly under the sun but can still burn with prolonged exposure. This tone often shows redness or uneven tone after irritation.",
    characteristics: [
      "Tans mildly and sometimes burns",
      "May develop mild hyperpigmentation from acne or sun",
      "Sensitive to environmental stressors like wind and pollution",
      "Natural undertones may be warm, cool, or neutral — product shades matter",
    ],
    focus: [
      "SPF protection (SPF 30–50 daily)",
      "Brightening + barrier care (niacinamide, vitamin C, licorice extract)",
      "Mild exfoliation once or twice a week (lactic acid or enzyme exfoliants)",
      "Antioxidants to prevent dullness",
    ],
    cautions: [
      "Avoid overuse of strong actives (like high % acids)",
      "Ensure consistent sunscreen even on cloudy days",
    ],
    imageUrl: light,
  },
  {
    id: "dark",
    type: "Dark",
    description:
      "Dark skin has a higher melanin level that offers natural UV protection but is more prone to post-inflammatory hyperpigmentation. This tone benefits from brightening and even-tone maintenance.",
    characteristics: [
      "Tans easily, rarely burns",
      "More resistant to sun damage but still vulnerable to uneven pigmentation",
      "Acne and inflammation can leave darker marks that take longer to fade",
      "Skin may appear dull without regular exfoliation or hydration",
    ],
    focus: [
      "Brightening & tone-evening ingredients (niacinamide, azelaic acid, vitamin C)",
      "Daily sunscreen (SPF 30+)",
      "Hydration-rich care to maintain smooth texture",
      "Gentle exfoliation to prevent dullness and hyperpigmentation buildup",
    ],
    cautions: [
      "Avoid harsh exfoliants — they may worsen pigmentation",
      "Be cautious with laser or bleaching treatments",
      "Use actives gradually to avoid irritation-based darkening",
    ],
    imageUrl: dark,
  },
];

const ST = () => {
  const navigate = useNavigate();
  const [currentSkinType, setCurrentSkinType] = useState(null);
  const [currentSkinTone, setCurrentSkinTone] = useState(null);
  const [activeTab, setActiveTab] = useState("skintype");
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(skinTypes[0].id);
  const [selectedTone, setSelectedTone] = useState(skinTones[0].id);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate("/login");
          return;
        }

        const skinTypeRecord = await fetchUserSkinType(user.id);

        if (skinTypeRecord) {
          const details = getSkinTypeDetails(
            skinTypeRecord.skintype,
            skinTypeRecord.created_at
          );
          setCurrentSkinType(details);
          setSelectedType(skinTypeRecord.skintype);

          // For demo - in real app, you'd fetch this from your database
          setCurrentSkinTone(skinTones[0]);
          setSelectedTone(skinTones[0].id);
        }
      } catch (error) {
        console.error("Error loading skin data:", error);
        setError("Failed to load skin data. Please try again.");
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const updatedRecord = await saveUserSkinType(user.id, selectedType);
      const details = getSkinTypeDetails(
        selectedType,
        updatedRecord.created_at
      );

      setCurrentSkinType(details);
      setShowDialog(true);
      setTimeout(() => setShowDialog(false), 3000);
    } catch (error) {
      console.error("Error saving skin type:", error);
      setError("Failed to save skin type. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkinToneChange = async () => {
    if (!selectedTone) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you'd save this to your database
      const selectedToneData = skinTones.find(
        (tone) => tone.id === selectedTone
      );
      setCurrentSkinTone(selectedToneData);
      setShowDialog(true);
      setTimeout(() => setShowDialog(false), 3000);
    } catch (error) {
      console.error("Error saving skin tone:", error);
      setError("Failed to save skin tone. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const noSkinType = !currentSkinType && !isLoading;
  const noSkinTone = !currentSkinTone && !isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen ml-50 bg-gray-100 flex items-center justify-center">
        <Sidebar />
        <div className="text-center">Loading your skin type information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-50 bg-gray-100">
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
              Skin profile updated successfully!
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

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("skintype")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  activeTab === "skintype"
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Skin Type
              </button>
              <button
                onClick={() => setActiveTab("skintone")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  activeTab === "skintone"
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Skin Tone
              </button>
            </div>
          </div>

          {/* Skin Type Tab */}
          {activeTab === "skintype" && (
            <div className="space-y-8">
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
                <SkinTypeDetails
                  skinType={currentSkinType}
                  navigate={navigate}
                />
              ) : (
                <NoSkinTypeDetected />
              )}
            </div>
          )}

          {/* Skin Tone Tab */}
          {activeTab === "skintone" && (
            <div className="space-y-8">
              {/* Skin Tone Selector */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {noSkinTone
                        ? "Select Your Skin Tone"
                        : "Change Your Skin Tone"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {noSkinTone
                        ? "No skin tone selected yet. Please select your skin tone below."
                        : "Select your current skin tone below"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      disabled={isLoading}
                    >
                      {skinTones.map((tone) => (
                        <option key={tone.id} value={tone.id}>
                          {tone.type}
                        </option>
                      ))}
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSkinToneChange}
                      disabled={
                        isLoading ||
                        (currentSkinTone && selectedTone === currentSkinTone.id)
                      }
                      className={`px-4 py-2 rounded-lg ${
                        isLoading ||
                        (currentSkinTone && selectedTone === currentSkinTone.id)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-cyan-700 hover:bg-cyan-800 text-white"
                      }`}
                    >
                      {isLoading
                        ? "Saving..."
                        : noSkinTone
                        ? "Save Skin Tone"
                        : "Save Changes"}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Skin Tone Details */}
              {currentSkinTone ? (
                <SkinToneDetails
                  skinTone={currentSkinTone}
                  navigate={navigate}
                />
              ) : (
                <NoSkinToneDetected />
              )}
            </div>
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

const SkinToneDetails = ({ skinTone, navigate }) => (
  <>
    <div className="text-center mt-15 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">
        Your Skin Tone is:{" "}
        <span className="text-purple-600">{skinTone.type}</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{skinTone.description}</p>
    </div>

    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-6">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {skinTone.imageUrl && (
              <img
                src={skinTone.imageUrl}
                alt={`${skinTone.type} skin tone`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <SkinTypeSection
            title="Common Characteristics"
            items={skinTone.characteristics}
            color="purple"
          />
          <SkinTypeSection
            title="Skincare Focus"
            items={skinTone.focus}
            color="pink"
          />
          <SkinTypeSection
            title="Important Cautions"
            items={skinTone.cautions}
            color="pink"
          />
        </div>
      </div>

      {/* Action Buttons */}
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

const NoSkinToneDetected = () => (
  <div className="text-center space-y-6 mt-12">
    <h2 className="text-2xl font-semibold text-gray-900">
      No Skin Tone Selected Yet
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Please select your skin tone above and click "Save Skin Tone" to continue.
    </p>
  </div>
);

export default ST;
