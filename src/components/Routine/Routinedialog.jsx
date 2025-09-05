import { useState, useEffect } from "react";
import { Plus, X, Trash, Edit } from "lucide-react";
import ProductListDialog from "./ProductListDialog";
// ✅ Import the updateRoutine function
import { saveRoutine, updateRoutine } from "../../service/routineService";
import { supabase } from "../../lib/supabaseClient";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

// ✅ Add initialRoutineData to props
const RoutineDialog = ({ open, onOpenChange, onSave, initialRoutineData }) => {
  const [routineData, setRoutineData] = useState({
    type: "Morning",
    name: "",
    time: timeOptions[7],
    duration: 10,
  });
  const [steps, setSteps] = useState([{ id: 1, product: "", note: "" }]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // ✅ New useEffect to handle routine data initialization
  useEffect(() => {
    if (initialRoutineData) {
      setRoutineData({
        type: initialRoutineData.type || "Morning",
        name: initialRoutineData.name || "",
        time: initialRoutineData.time || timeOptions[7],
        duration: initialRoutineData.duration || 10,
      });

      // Map routine steps to component state format
      const mappedSteps = initialRoutineData.steps.map((step, index) => ({
        id: index + 1,
        productId: step.productId,
        productName: step.product, // The API returns 'product' as the name
        note: step.note || "",
      }));
      setSteps(
        mappedSteps.length > 0
          ? mappedSteps
          : [{ id: 1, product: "", note: "" }]
      );
    } else {
      // Reset to default for new routine
      setRoutineData({
        type: "Morning",
        name: "",
        time: timeOptions[7],
        duration: 10,
      });
      setSteps([{ id: 1, product: "", note: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoutineData]);

  const validateRoutine = () => {
    let errors = {};
    let isValid = true;

    if (!routineData.name.trim()) {
      errors.name = "Routine name is required.";
      isValid = false;
    }

    // Validate each step has a product
    steps.forEach((step, index) => {
      if (!step.productId) {
        errors[`step_${index}`] = "Please select a product.";
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const addStep = () => {
    const newStep = { id: steps.length + 1, product: "", note: "" };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id) => {
    setSteps((prevSteps) => prevSteps.filter((step) => step.id !== id));
  };

  const handleProductSelect = (product) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id === currentStepId) {
          return { ...step, productId: product.id, productName: product.name };
        }
        return step;
      })
    );
    setShowProductDialog(false);
  };

  const handleNoteChange = (stepId, value) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, note: value } : step
      )
    );
  };

  const handleRoutineChange = (field, value) => {
    setRoutineData({ ...routineData, [field]: value });
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    if (!validateRoutine()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        alert("You must be logged in to save a routine.");
        setIsSubmitting(false);
        return;
      }
      const currentUserId = user.id;

      const routineToSave = {
        ...routineData,
        steps: steps
          .filter((step) => step.productId)
          .map(({ id, productId, note }) => ({
            stepNumber: id,
            product: productId,
            note,
          })),
        // ✅ Add routine ID for updates
        id: initialRoutineData ? initialRoutineData.id : null,
      };

      // ✅ Use a different function for updating
      if (initialRoutineData) {
        await updateRoutine(routineToSave, currentUserId);
        alert("Routine updated successfully!");
      } else {
        await saveRoutine(routineToSave, currentUserId);
        alert("Routine saved successfully!");
      }

      onOpenChange(false);
      // ✅ Call the onSave prop to notify parent component
      onSave(routineToSave);
    } catch (error) {
      alert("Failed to save routine: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    validateRoutine();
  }, [steps, routineData.name]);

  const hasValidationErrors = Object.values(validationErrors).some(
    (e) => e.length > 0
  );
  const dialogTitle = initialRoutineData
    ? "Edit Routine"
    : "Create New Routine";
  const buttonText = initialRoutineData ? "Update Routine" : "Save Routine";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-3xl w-full relative border border-gray-800 shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 flex-grow overflow-auto">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ✅ Dynamic Dialog Title */}
              <h2 className="text-xl font-semibold mb-6">{dialogTitle}</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routine Type
                    </label>
                    <select
                      value={routineData.type}
                      onChange={(e) =>
                        handleRoutineChange("type", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Morning</option>
                      <option>Night</option>
                      <option>Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      value={routineData.name}
                      onChange={(e) =>
                        handleRoutineChange("name", e.target.value)
                      }
                      placeholder="e.g. 'My Glow Routine'"
                      className={`w-full rounded border p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      value={routineData.time}
                      onChange={(e) =>
                        handleRoutineChange("time", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {timeOptions.map((time) => (
                        <option key={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={routineData.duration}
                      onChange={(e) =>
                        handleRoutineChange(
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routine Steps
                  </label>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium">Step {index + 1}</span>
                          {steps.length > 1 && (
                            <button
                              onClick={() => handleDeleteStep(step.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Product
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={step.productName || ""}
                                readOnly
                                onClick={() => {
                                  setCurrentStepId(step.id);
                                  setShowProductDialog(true);
                                }}
                                placeholder="Select your product"
                                className={`w-full rounded border p-2 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                  validationErrors[`step_${index}`]
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <button
                                onClick={() => {
                                  setCurrentStepId(step.id);
                                  setShowProductDialog(true);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                            {validationErrors[`step_${index}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {validationErrors[`step_${index}`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Note (optional)
                            </label>
                            <input
                              type="text"
                              value={step.note}
                              onChange={(e) =>
                                handleNoteChange(step.id, e.target.value)
                              }
                              placeholder="e.g. 'Apply to damp skin'"
                              className="w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {steps.length === 0 && validationErrors.steps && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.steps}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={addStep}
                      className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Step
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={handleSave}
                    disabled={isSubmitting || hasValidationErrors}
                  >
                    {isSubmitting ? "Saving..." : buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ProductListDialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        onSelectProduct={(product) => {
          handleProductSelect(product);
        }}
      />
    </>
  );
};

export default RoutineDialog;
