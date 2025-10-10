import { useState, useEffect } from "react";
import { Plus, ChevronDown, Edit2, Trash2, X } from "lucide-react";
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
            <h1 className="text-2xl font-bold text-gray-800">My Routines</h1>
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

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-1 rounded-lg p-6 max-w-md w-full">
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
        className="fixed bottom-6 right-6 z-50 bg-cyan-800 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-all"
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

export default RoutinesPage;
