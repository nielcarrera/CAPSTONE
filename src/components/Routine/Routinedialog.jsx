import { useState } from "react";
import { Plus, X, Trash, Edit } from "lucide-react";
import ProductListDialog from "./ProductListDialog";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

const RoutineDialog = ({ open, onOpenChange, onSave }) => {
  const [routineData, setRoutineData] = useState({
    type: "Morning",
    name: "",
    time: timeOptions[7], // Default to 7:00 AM
    duration: 10,
  });
  const [steps, setSteps] = useState([{ id: 1, product: "", note: "" }]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStep = () => {
    const newStep = { id: steps.length + 1, product: "", note: "" };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id) => {
    setSteps((prevSteps) => prevSteps.filter((step) => step.id !== id));
  };

  const handleProductSelect = (productName) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === currentStepId ? { ...step, product: productName } : step
      )
    );
    setShowProductDialog(false); // Close dialog after selection
  };

  const handleProductChange = (stepId, value) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, product: value } : step
      )
    );
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
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const routineToSave = {
        ...routineData,
        steps: steps.filter((step) => step.product.trim() !== ""), // Remove empty steps
        createdAt: new Date().toISOString(),
      };

      await onSave(routineToSave);
      alert("Routine saved successfully!");
      onOpenChange(false);
    } catch (error) {
      alert("Failed to save routine: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg max-w-3xl w-full relative border border-gray-800 shadow-xl max-h-[90vh] flex flex-col">
          <div className="p-6 flex-grow overflow-auto">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-6">Create New Routine</h2>

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
                    className="w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                      handleRoutineChange("duration", parseInt(e.target.value))
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
                  {steps.map((step) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-medium">Step {step.id}</span>
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
                              value={step.product}
                              onChange={(e) =>
                                handleProductChange(step.id, e.target.value)
                              }
                              placeholder="Select your product"
                              className="w-full rounded border border-gray-300 p-2 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              onClick={() => {
                                setCurrentStepId(step.id);
                                setShowProductDialog(true);
                              }}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Routine"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductListDialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        onSelectProduct={handleProductSelect}
      />
    </>
  );
};

export default RoutineDialog;
