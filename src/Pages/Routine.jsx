import { useState, useEffect } from "react";
import { Plus, ChevronDown, Edit2, Trash2, X, HelpCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RoutineDialog from "../components/Routine/Routinedialog";
import { useAuth } from "../context/AuthProvider";
import { products } from "../Pages/utils/Productdata";
import { supabase } from "../lib/supabaseClient";

// ✅ Import the new updateRoutine function
import {
  fetchUserRoutines,
  updateRoutine,
  deleteRoutine,
} from "../service/routineService";

const RoutinesPage = () => {
  const { currentUser: user } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [visibleSections, setVisibleSections] = useState({
    morning: true,
    night: true,
    custom: true,
  });
  const [notificationStates, setNotificationStates] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleNotification = (routineId) => {
    setNotificationStates((prev) => ({
      ...prev,
      [routineId]: !prev[routineId],
    }));
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      const savedRoutines = await fetchUserRoutines(user.id);
      console.log("Fetched routines:", savedRoutines);

      const mappedRoutines = savedRoutines.map((r) => ({
        id: r.routine_id,
        name: r.routine_name,
        type: r.type,
        time: r.time,
        duration: r.duration,
        steps: r.steps.map((step, index) => ({
          stepNumber: step.step_number,
          product: step.product_name,
          productId: step.product_id,
          usage: step.usage,
          type: step.product_type, // ✅ Add this
          id: step.step_number || index,
        })),

        notificationEnabled: true,
      }));

      setRoutines(mappedRoutines);
    } catch (err) {
      console.error("Error loading routines:", err.message);
    }
  };

  // ✅ Updated handleSaveRoutine to handle both create and edit
  const handleSaveRoutine = async (savedRoutine) => {
    // Reload routines to ensure state is in sync with the database
    await loadRoutines();
    setShowDialog(false);
    setEditingRoutine(null); // Reset editing state
  };

  const handleDeleteRoutine = async (id) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to delete a routine.");
        return;
      }
      // Call a delete function in routineService
      await deleteRoutine(id, user.id);
      setRoutines(routines.filter((routine) => routine.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      alert("Failed to delete routine: " + error.message);
    }
  };

  // ✅ New function to set the routine for editing
  const handleEditRoutine = (routine) => {
    setEditingRoutine(routine);
    setShowDialog(true);
  };

  // ✅ New function to close the dialog and reset editing state
  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingRoutine(null);
  };

  const getProductDetails = (productName) => {
    const product = products.find((p) => p.name === productName);
    if (!product)
      return { type: "Unknown", bodyPart: "Unknown", area: "unknown" };

    return {
      type: product.type,
      bodyPart: product.area === "body" ? product.bodyPart : product.area,
      area: product.area,
    };
  };

  const renderSection = (title, type) => (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={() => toggleSection(type.toLowerCase())}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronDown
            size={20}
            className={`text-gray-600 transition-transform ${
              visibleSections[type.toLowerCase()] ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {visibleSections[type.toLowerCase()] && (
        <div className="p-6">
          {routines.filter((r) => r.type?.toLowerCase() === type.toLowerCase())
            .length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No routine yet</p>
              <button
                onClick={() => setShowDialog(true)}
                className="inline-flex items-center px-6 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Routine
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {routines
                .filter((r) => r.type.toLowerCase() === type.toLowerCase())
                .map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
                  >
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {routine.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              {/* ...time icon... */}
                              {routine.time}
                            </span>
                            <span className="flex items-center gap-1">
                              {/* ...duration icon... */}
                              {routine.duration} mins
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditRoutine(routine)} // ✅ Use the new edit handler
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit routine"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(routine.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete routine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pb-6 relative">
                      <div className="overflow-x-auto">
                        <table className="w-full rounded-sm overflow-hidden">
                          <thead className="bg-cyan-800 text-white">
                            <tr className="text-left text-sm">
                              <th className="py-3 pl-6 pr-4 font-medium w-20">
                                Step
                              </th>
                              <th className="py-3 px-4 font-medium border-l border-cyan-700">
                                Product
                              </th>
                              <th className="py-3 px-4 font-medium border-l border-cyan-700">
                                Type
                              </th>
                              <th className="py-3 px-4 font-medium border-l border-cyan-700">
                                Area
                              </th>
                              <th className="py-3 px-4 font-medium border-l border-cyan-700">
                                Usage
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {routine.steps.map((step) => {
                              const productDetails = getProductDetails(
                                step.product
                              );
                              const areaText =
                                productDetails.area === "body"
                                  ? productDetails.bodyPart
                                  : "Face";
                              const areaBgColor =
                                productDetails.area === "body"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800";

                              return (
                                <tr
                                  key={step.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="py-3 pl-6 pr-4 text-gray-800 font-medium">
                                    {step.stepNumber}
                                  </td>
                                  <td className="py-3 px-4 text-gray-800 border-l border-gray-200">
                                    {step.product}
                                  </td>
                                  <td className="py-3 px-4 border-l border-gray-200">
                                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700 capitalize">
                                      {step.type || "Unknown"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 border-l border-gray-200">
                                    <span
                                      className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${areaBgColor}`}
                                    >
                                      {areaText}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-gray-600 text-sm border-l border-gray-200">
                                    {step.usage || "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="p-4 md:p-8 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">My Routines</h1>
              <button
                onClick={() => setShowHelpGuide(true)}
                className="p-3 bg-cyan-100 text-cyan-700 rounded-full shadow-md hover:bg-cyan-200 hover:text-cyan-800 transition-all duration-300 transform hover:scale-105 ring-4 ring-cyan-400/50" // Added background, larger padding, rounded-full, shadow, and ring for emphasis
                title="Skincare Routine Guide"
              >
                <HelpCircle className="w-6 h-6" />{" "}
                {/* Increased icon size to w-6 h-6 */}
              </button>
            </div>
            <button
              onClick={() => {
                setEditingRoutine(null); // Reset to ensure a new routine is created
                setShowDialog(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Routine
            </button>
          </div>

          <div className="space-y-6">
            {renderSection("Morning Routine", "morning")}
            {renderSection("Night Routine", "night")}
            {renderSection("Custom Routine", "custom")}
          </div>
        </div>
      </div>

      {/* Help Guide Modal */}
      {showHelpGuide && (
        <SkincareRoutineGuide onClose={() => setShowHelpGuide(false)} />
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this routine? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRoutine(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setEditingRoutine(null);
          setShowDialog(true);
        }}
        className="fixed bottom-6 right-6 z-50 bg-cyan-800 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-all hover:scale-110"
        title="Add Routine"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ✅ Pass initialRoutineData prop */}
      <RoutineDialog
        open={showDialog}
        onOpenChange={handleDialogClose} // Use the new close handler
        onSave={handleSaveRoutine}
        initialRoutineData={editingRoutine}
      />
    </div>
  );
};

// Modern Web Help Guide Component
const SkincareRoutineGuide = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("basics");

  const steps = [
    {
      number: 1,
      title: "Cleanse",
      description:
        "Start with a gentle cleanser to remove impurities and prepare your skin for better product absorption.",
      icon: "🧼",
      color: "from-blue-500 to-cyan-500",
      tips: [
        "Use lukewarm water",
        "Massage gently for 60 seconds",
        "Pat dry don't rub",
      ],
    },
    {
      number: 2,
      title: "Treat",
      description:
        "Apply serums or treatments targeting specific concerns like acne, aging, or hydration.",
      icon: "✨",
      color: "from-purple-500 to-pink-500",
      tips: [
        "Apply to damp skin",
        "Use pea-sized amount",
        "Focus on problem areas",
      ],
    },
    {
      number: 3,
      title: "Moisturize",
      description:
        "Lock in moisture with a cream or lotion suitable for your skin type to maintain hydration.",
      icon: "💧",
      color: "from-green-500 to-emerald-500",
      tips: [
        "Apply while skin is damp",
        "Neck and décolletage too",
        "Adjust thickness by season",
      ],
    },
    {
      number: 4,
      title: "Protect",
      description:
        "Finish with sunscreen to protect against UV damage. Essential for daytime routines.",
      icon: "☀️",
      color: "from-amber-500 to-orange-500",
      tips: [
        "SPF 30+ minimum",
        "Reapply every 2 hours",
        "Don't forget ears and neck",
      ],
    },
  ];

  const skinTypes = [
    {
      type: "Oily",
      routine: "Gel cleanser, oil-free moisturizer, non-comedogenic sunscreen",
      color: "bg-blue-50 border-blue-200",
    },
    {
      type: "Dry",
      routine: "Cream cleanser, hydrating serum, rich moisturizer",
      color: "bg-amber-50 border-amber-200",
    },
    {
      type: "Combination",
      routine:
        "Balancing cleanser, targeted treatments, lightweight moisturizer",
      color: "bg-purple-50 border-purple-200",
    },
    {
      type: "Sensitive",
      routine: "Fragrance-free products, gentle cleanser, soothing moisturizer",
      color: "bg-green-50 border-green-200",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <span className="text-2xl">🧴</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Skincare Routine Guide</h2>
                <p className="text-cyan-100">
                  Build your perfect routine step by step
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {["basics", "skin-types", "tips"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-cyan-800"
                    : "text-cyan-100 hover:text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "basics" && (
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Steps */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    The Essential Steps
                  </h3>
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-cyan-200 hover:shadow-md transition-all"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                      >
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{step.icon}</span>
                          <h4 className="font-semibold text-gray-800">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {step.tips.map((tip, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                            >
                              {tip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Guide */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Routine Flow
                  </h3>
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold z-10`}
                        >
                          {step.number}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-300 to-blue-300 -ml-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-white rounded-lg border border-cyan-200">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      💡 Remember
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Apply products from thinnest to thickest consistency
                      </li>
                      <li>• Wait 30-60 seconds between layers</li>
                      <li>• Always patch test new products</li>
                      <li>• Consistency is key for results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "skin-types" && (
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Routine by Skin Type
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {skinTypes.map((skin) => (
                  <div
                    key={skin.type}
                    className={`p-6 rounded-xl border-2 ${skin.color} hover:shadow-md transition-all`}
                  >
                    <h4 className="font-bold text-lg text-gray-800 mb-3">
                      {skin.type} Skin
                    </h4>
                    <p className="text-gray-600 mb-4">Recommended products:</p>
                    <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded-lg">
                      {skin.routine}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Expert Tips
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Rotate active ingredients (don't use all at once)",
                      "Store products in cool, dark places",
                      "Replace products every 6-12 months",
                      "Listen to your skin - adjust as needed",
                      "Don't introduce multiple new products at once",
                      "Hydration starts from within - drink water!",
                    ].map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-cyan-600 text-lg">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Weekly Schedule
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { day: "Monday", activity: "Full routine + Exfoliation" },
                      { day: "Tuesday", activity: "Basic maintenance" },
                      { day: "Wednesday", activity: "Full routine + Mask" },
                      { day: "Thursday", activity: "Basic maintenance" },
                      { day: "Friday", activity: "Full routine + Treatment" },
                      { day: "Weekend", activity: "Gentle routine + Recovery" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded-lg"
                      >
                        <span className="font-medium text-gray-800">
                          {item.day}
                        </span>
                        <span className="text-gray-600 text-right">
                          {item.activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Need personalized advice? Consult with a dermatologist for your
              specific concerns.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Start Building Routine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutinesPage;
