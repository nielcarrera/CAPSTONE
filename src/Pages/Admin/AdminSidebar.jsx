// src/components/AdminSidebar.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp"; // Adjust path
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useLogout } from "../../Pages/hooks/hooks"; // Adjust path

// --- Constants for widths ---
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 80;
const MOBILE_WIDTH = 240;

const AdminSidebar = ({
  className,
  isCollapsed,
  isMobile,
  isMobileOpen,
  toggleSidebar,
}) => {
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const location = useLocation();
  const logout = useLogout();

  const menuItems = [
    // --- THIS IS THE FIX ---
    { icon: Users, label: "Account Management", path: "/admin/accounts" },
    // ^^^ The path was "/adminaccounts", now it's "/admin/accounts"
    { icon: Package, label: "Product Management", path: "/admin/products" },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => location.pathname === subItem.path)
    );
    if (currentItem) {
      setOpenSubMenu(true);
    }
  }, [location.pathname, menuItems]);

  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-40 p-3 rounded-2xl bg-[#1A1F2C] text-white md:hidden shadow-lg border border-white/10 backdrop-blur-sm"
        style={{ borderRadius: "16px" }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        initial={false}
        animate={{
          width: isMobile
            ? MOBILE_WIDTH
            : isCollapsed
            ? COLLAPSED_WIDTH
            : EXPANDED_WIDTH,
          x: isMobileOpen || !isMobile ? 0 : -MOBILE_WIDTH,
        }}
        className={`fixed left-0 top-0 h-screen bg-[#1A1F2C] text-white flex flex-col z-40 backdrop-blur-sm bg-opacity-95 ${
          className || ""
        }`}
        style={{
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div
          className="flex flex-col items-center justify-center px-6"
          style={{ height: "100px" }}
        >
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="w-50 h-37 rounded-2xl shadow-md"
              style={{ borderRadius: "16px" }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 mt-6 px-4 flex flex-col overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex-1 space-y-1">
            {menuItems.map((item, index) => {
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);

              return item.section ? (
                <div
                  key={index}
                  className="px-4 py-3 text-sm text-gray-400 mt-4 font-medium"
                >
                  {item.section}
                </div>
              ) : (
                <div key={index}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between gap-4 px-4 py-3 mb-1 transition-all duration-200 hover:bg-white/10 ${
                        isActive ? "bg-white/20 text-white shadow-md" : ""
                      }`}
                      style={{ borderRadius: "14px" }}
                      onClick={(e) => {
                        if (item.subItems) {
                          e.preventDefault();
                          toggleSubMenu();
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={22} />
                        {(!isCollapsed || isMobile) && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </div>
                      {item.subItems &&
                        (!isCollapsed || isMobile) &&
                        (openSubMenu ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        ))}
                    </Link>
                  </motion.div>

                  {/* Submenu (if you add any) */}
                  {item.subItems && openSubMenu && !isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-2"
                      style={{
                        borderLeft: "2px solid rgba(255, 255, 255, 0.1)",
                        marginLeft: "1rem",
                      }}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.div
                          key={subIndex}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={subItem.path}
                            className={`flex items-center gap-4 px-4 py-3 mb-1 transition-all duration-200 hover:bg-white/10 ${
                              location.pathname === subItem.path
                                ? "bg-white/20 text-white shadow-md"
                                : ""
                            }`}
                            style={{
                              borderRadius: "12px",
                              paddingLeft: "2.5rem",
                            }}
                          >
                            <span className="text-sm font-medium">
                              {subItem.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-auto mb-6">
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={logout}
                className="flex items-center gap-4 px-4 py-3 mb-1 hover:bg-white/10 transition-all duration-200 w-full text-left border-t border-white/10 pt-4"
                style={{ borderRadius: "14px" }}
                type="button"
              >
                <LogOut size={22} />
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium">Logout</span>
                )}
              </button>
            </motion.div>
          </div>
        </nav>
      </motion.div>
    </>
  );
};

export default AdminSidebar;
