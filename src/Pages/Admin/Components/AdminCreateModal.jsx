import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Mail, Shield, Calendar, AlertTriangle } from "lucide-react";

const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  // --- FIX 1: Tailwind Class Lookup ---
  // Tailwind CSS cannot build class names dynamically from variables
  // (e.g., `max-w-${size}`). We must provide the full class name.
  // This lookup object maps your "size" prop to the correct class.
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // --- FIX 2: Added a background color (`bg-gray-900/50`) ---
          // You had `bg-opacity-50` but no base color. This adds the dark backdrop.
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            // --- FIX 1 (Applied) ---
            // Here we use the lookup object to get the correct class.
            className={`bg-white rounded-2xl shadow-xl w-full ${
              sizeClasses[size] || sizeClasses.md
            } mx-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AccountModal = ({
  isOpen,
  onClose,
  type,
  user,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });

  useEffect(() => {
    if (type === "edit" && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "", // Don't pre-fill password for security
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "User",
        password: "",
      });
    }
  }, [type, user, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const [firstName, ...lastNameParts] = formData.name.trim().split(" ");
    const first_name = firstName;
    const last_name = lastNameParts.join(" ") || null;

    const payload = {
      first_name,
      last_name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    };

    if (type === "add") {
      onAdd(payload);
    } else if (type === "edit") {
      onEdit(user.id, payload);
    }
  }; // ✅ <-- This was missing!

  const handleDelete = () => {
    onDelete(user.id);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (type === "delete") {
    return (
      // This will now correctly be `max-w-sm`
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">{user?.name}</span>?
            This action cannot be undone.
          </p>

          {/* --- FIX 3: Consistent Footer --- */}
          {/* Added `pt-4 border-t` to match the Add/Edit form's footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const isEdit = type === "edit";
  const title = isEdit ? "Edit User" : "Add New User";

  return (
    // This will now correctly be `max-w-lg`
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <User className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <User size={16} className="mr-2" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Mail size={16} className="mr-2" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Shield size={16} className="mr-2" />
                {isEdit ? "New Password (optional)" : "Password"}
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required={!isEdit}
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                placeholder={
                  isEdit ? "Leave blank to keep current" : "Enter password"
                }
              />
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Shield size={16} className="mr-2" />
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
            >
              {isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AccountModal;
