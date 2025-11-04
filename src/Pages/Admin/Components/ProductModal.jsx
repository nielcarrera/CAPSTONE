// ProductModal.jsx - Updated version
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2, AlertTriangle } from "lucide-react";

const ProductModal = ({
  isOpen,
  onClose,
  type,
  product,
  onAdd,
  onEdit,
  onDelete,
  area = "face", // Default to face products
}) => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    severity: "mild",
    ingredients: [],
    skinType: "",
    impurity: "",
    cautions: [],
    usage: "",
    bodypart: "",
  });
  const [ingredientInput, setIngredientInput] = useState("");
  const [cautionInput, setCautionInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        type: product.type || "",
        name: product.name || "",
        description: product.description || "",
        severity: product.severity || "mild",
        ingredients: product.ingredients || [],
        skinType: product.skinType || "",
        impurity: product.impurity || "",
        cautions: product.cautions || [],
        usage: product.usage || "",
        bodypart: product.bodypart || "",
      });
    } else {
      setFormData({
        type: "",
        name: "",
        description: "",
        severity: "mild",
        ingredients: [],
        skinType: "",
        impurity: "",
        cautions: [],
        usage: "",
        bodypart: "",
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (area === "body" && !formData.bodypart.trim())
      newErrors.bodypart = "Body part is required for body products";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      ...formData,
      area: area, // Set the area based on the current tab
    };

    if (type === "add") {
      onAdd(productData);
    } else if (type === "edit") {
      onEdit({ ...productData, id: product.id });
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(product.id);
    onClose();
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addCaution = () => {
    if (cautionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        cautions: [...prev.cautions, cautionInput.trim()],
      }));
      setCautionInput("");
    }
  };

  const removeCaution = (index) => {
    setFormData((prev) => ({
      ...prev,
      cautions: prev.cautions.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (type === "delete") {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Product
                    </h3>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete{" "}
                  <strong>"{product?.name}"</strong>? This will permanently
                  remove the product from the system.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Product
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {type === "add"
                  ? `Add New ${area === "face" ? "Face" : "Body"} Product`
                  : `Edit ${area === "face" ? "Face" : "Body"} Product`}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Basic Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type *
                      </label>
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.type ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="e.g., cleanser, serum, lotion"
                      />
                      {errors.type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.type}
                        </p>
                      )}
                    </div>

                    {/* Body Part Field - Only for Body Products */}
                    {area === "body" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Body Part *
                        </label>
                        <input
                          type="text"
                          value={formData.bodypart}
                          onChange={(e) =>
                            handleInputChange("bodypart", e.target.value)
                          }
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            errors.bodypart
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., arms, legs, all"
                        />
                        {errors.bodypart && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.bodypart}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Properties */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Product Properties
                    </h3>

                    {/* Severity Field - Only for Face Products */}
                    {area === "face" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Severity
                        </label>
                        <select
                          value={formData.severity}
                          onChange={(e) =>
                            handleInputChange("severity", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="strong">Strong</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skin Type
                      </label>
                      <input
                        type="text"
                        value={formData.skinType}
                        onChange={(e) =>
                          handleInputChange("skinType", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., oily, dry, combination, all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Impurity
                      </label>
                      <input
                        type="text"
                        value={formData.impurity}
                        onChange={(e) =>
                          handleInputChange("impurity", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., acne, dryness, hyperpigmentation"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Describe the product and its benefits..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addIngredient())
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Add an ingredient"
                    />
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-2 text-cyan-600 hover:text-cyan-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Usage & Cautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Instructions
                    </label>
                    <textarea
                      value={formData.usage}
                      onChange={(e) =>
                        handleInputChange("usage", e.target.value)
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="How to use this product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cautions
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={cautionInput}
                        onChange={(e) => setCautionInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addCaution())
                        }
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Add a caution"
                      />
                      <button
                        type="button"
                        onClick={addCaution}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.cautions.map((caution, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                        >
                          {caution}
                          <button
                            type="button"
                            onClick={() => removeCaution(index)}
                            className="ml-2 text-amber-600 hover:text-amber-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {type === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
