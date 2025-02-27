import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import combi from "../assets/combi.webp";
import RoutineModal from "../components/Routinemodal";

// Dummy data for database integration - this will be replaced with actual API call
const skinTypeData = {
  id: "1",
  type: "Combination",
  description:
    "Your skin can be dry or normal in some areas and oily in others, such as the T-zone (nose, forehead, and chin). Many people have this type. It may need slightly different care in different areas.",
  imageUrl: [combi],
  characteristics: [
    "Oily T-zone (forehead, chin and nose) ",
    "Enlarged pores",
    "Blackheads",
    "Shiny skin",
  ],
  causes: [
    "Hormonal changes, such as those that occur during puberty or menstruation",
    "Mainly Genetics",
  ],
  generaltips: [
    "Use a lightweight moisturizer for hydration and a targeted treatment (like a serum or exfoliant) for the oily areas",
  ],
};

const ST = () => {
  const navigate = useNavigate();
  // Simulating data fetching state - replace with actual data fetching
  const [userData, setUserData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="min-h-screen mt-20 ml-50 bg-gray-200">
      <Navbar />
      <Sidebar />
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Mobile App Promotion - Always visible */}
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
                <p className="text-gray-300 ">
                  Use our mobile app for real-time skin analysis with your
                  phone's camera
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>

          {skinTypeData ? (
            // Show this section only if user has skin type data
            <>
              <div className="text-center mt-15 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Your Skin Type is:{" "}
                  <span className="text-purple-600">{skinTypeData.type}</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto ">
                  Understanding your skin type is the first step towards
                  achieving healthy, glowing skin. Below are your personalized
                  insights and recommendations.
                </p>
              </div>

              {/* Main Results Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Image and Description */}
                  <div className="space-y-6">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={skinTypeData.imageUrl}
                        alt={`${skinTypeData.type} skin type visualization`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <p className="text-gray-600 flex ">
                        {skinTypeData.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Characteristics and Causes */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Key Characteristics
                      </h3>
                      <ul className="space-y-2">
                        {skinTypeData.characteristics.map((char, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 text-gray-600"
                          >
                            <div className="w-2 h-2 bg-purple-300 rounded-full" />
                            <span>{char}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Causes
                      </h3>
                      <ul className="space-y-2">
                        {skinTypeData.causes.map((cause, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 text-gray-600"
                          >
                            <div className="w-2 h-2 bg-pink-300 rounded-full" />
                            <span>{cause}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        General Tips
                      </h3>
                      <ul className="space-y-2">
                        {skinTypeData.generaltips.map((generaltips, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 text-gray-600"
                          >
                            <div className="w-2 h-2 bg-pink-300 rounded-full" />
                            <span>{generaltips}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                <RoutineModal
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                />
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-10 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDialog(true)}
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
                <p className="text-sm mt-10 opacity-65">
                  Note : Start generating personalized routine based on your
                  skin type by clicking the button on the left. Access our
                  special feature by having our mobile application and start
                  tracking your skin impurities.
                </p>
              </div>
            </>
          ) : (
            // Show this section if user has no skin type data
            <div className="text-center space-y-6 mt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                No Skin Analysis Results Yet
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get started by identifying your skin type using our mobile app.
                Our advanced AI technology will analyze your skin and provide
                personalized recommendations.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/download")}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Download App Now
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ST;
