// src/layouts/AdminLayout.jsx

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"; // <-- Import Outlet!
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar"; // Adjust path as needed

// --- Constants for widths ---
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 80;

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // --- Sidebar State Management ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      } else {
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isSCollapsed);
    }
  };

  const getMarginLeft = () => {
    if (isMobile) {
      return 0;
    }
    return isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* The Sidebar is rendered here, permanently */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: getMarginLeft(),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full min-h-screen"
      >
        <div className="p-4 md:p-8">
          {/* Your AccountManagement.jsx page is rendered right here */}
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;
