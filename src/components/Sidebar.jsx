import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  User,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Recycle,
  PillBottle,
  Package,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useLogout } from "../Pages/hooks/hooks";

// --- FIX 1: Use constants for widths for easier maintenance ---
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 80;
const MOBILE_WIDTH = 240;

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const location = useLocation();
  const logout = useLogout();

  const menuItems = [
    { icon: BarChart2, label: "Dashboard", path: "/lp" },
    {
      icon: BarChart2,
      label: "Comprehensive Analysis",
      path: "/db", // A parent path can be useful, though not strictly required here
      subItems: [
        { label: "Face", path: "/db" },
        { label: "Body", path: "/body" },
      ],
    },
    { icon: User, label: "My Skin Type", path: "/skintype" },
    { icon: Recycle, label: "My Routines", path: "/routine" },
    { icon: PillBottle, label: "My Products", path: "/product" },
    { section: "Preferences" },
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: HelpCircle, label: "FAQ'S", path: "/faqs" },
  ];

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

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => location.pathname === subItem.path)
    );
    if (currentItem) {
      setOpenSubMenu(true);
    }
  }, [location.pathname, menuItems]); // Added menuItems to dependency array

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#1A1F2C] text-white md:hidden"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          // Use the constants for the width
          width: isMobile
            ? MOBILE_WIDTH
            : isCollapsed
            ? COLLAPSED_WIDTH
            : EXPANDED_WIDTH,
          // Use constant for sliding out on mobile
          x: isMobileOpen || !isMobile ? 0 : -MOBILE_WIDTH,
        }}
        className={`fixed left-0 top-0 h-screen bg-[#1A1F2C] text-white flex flex-col z-40 ${
          className || ""
        }`}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mt-5 flex items-center p-6 justify-between">
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? <Menu size={24} /> : <X size={24} />}
            </button>
          )}
        </div>

        <nav
          className="flex-1 mt-10 px-4 flex flex-col overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex-1">
            {menuItems.map((item, index) =>
              item.section ? (
                (!isCollapsed || isMobile) && (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-400 mt-4"
                  >
                    {item.section}
                  </div>
                )
              ) : (
                <div key={index}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg mb-1 transition-colors hover:bg-white/10 ${
                        location.pathname === item.path ||
                        (item.subItems &&
                          item.subItems.some(
                            (subItem) => location.pathname === subItem.path
                          ))
                          ? "bg-white/20 text-white"
                          : ""
                      }`}
                      onClick={(e) => {
                        if (item.subItems) {
                          e.preventDefault();
                          toggleSubMenu();
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={24} />
                        {(!isCollapsed || isMobile) && (
                          <span>{item.label}</span>
                        )}
                      </div>
                      {item.subItems &&
                        (!isCollapsed || isMobile) &&
                        (openSubMenu ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        ))}
                    </Link>
                  </motion.div>

                  {/* --- FIX 2: Simplified and corrected submenu visibility logic --- */}
                  {item.subItems && openSubMenu && !isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.div
                          key={subIndex}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={subItem.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-colors hover:bg-white/10 ${
                              location.pathname === subItem.path
                                ? "bg-white/20 text-white"
                                : ""
                            }`}
                            style={{ paddingLeft: "3.5rem" }} // Indentation for sub-items
                          >
                            <span>{subItem.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )
            )}
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={logout}
              className="flex items-center gap-4 px-4 py-3 rounded-lg mb-4 hover:bg-white/10 transition-colors w-full text-left"
              type="button"
            >
              <LogOut size={24} />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </button>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
