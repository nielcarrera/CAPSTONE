import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import ProductManagement from "./ProductManagement";
import AccountManagement from "./AccountManagement";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 80;

const AdminPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // ✅ Sidebar Visible for /admin and /adminaccounts
  const showSidebar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/adminaccounts");

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

  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const getMarginLeft = () => {
    if (!showSidebar || isMobile) return 0;
    return isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Render Sidebar Only If showSidebar is TRUE */}
      {showSidebar && (
        <AdminSidebar
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          isMobileOpen={isMobileOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <motion.main
        initial={false}
        animate={{
          marginLeft: getMarginLeft(),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full min-h-screen"
      >
        <div className="p-4 md:p-8">
          <Routes>
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="products" element={<ProductManagement />} />
          </Routes>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminPanel;
