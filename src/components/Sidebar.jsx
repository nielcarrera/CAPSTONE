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
} from "lucide-react";

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: BarChart2, label: "Dashboard", path: "/lp" },
    { icon: BarChart2, label: "Comprehensive Analysis", path: "/db" },
    { icon: User, label: "My Skin Type", path: "/skintype" },
    { icon: Recycle, label: "My Routines", path: "/routine" },
    { icon: PillBottle, label: "My Products", path: "/product" },
    { icon: Package, label: "Product Recommendations", path: "/products" },
    { section: "Preferences" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: HelpCircle, label: "FAQ'S", path: "/faqs" },
  ];

  // Check screen size and adjust sidebar state accordingly
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

    handleResize(); // Call once initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button - visible only on small screens */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-[#1A1F2C] text-white md:hidden"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay when sidebar is open */}
      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isMobile ? 280 : isCollapsed ? 80 : 280,
          x: isMobileOpen || !isMobile ? 0 : -280,
        }}
        className={`fixed left-0 top-0 h-screen bg-[#1A1F2C] text-white flex flex-col z-30 ${
          className || ""
        }`}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mt-5 flex items-center p-6 justify-between">
          {!isCollapsed && (
            <h1 className="font-bold text-2xl">Insecurity Free</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>

        <nav className="flex-1 mt-10 px-4 flex flex-col overflow-y-auto">
          <div className="flex-1">
            {menuItems.map((item, index) =>
              item.section ? (
                !isCollapsed && (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-400 mt-4"
                  >
                    {item.section}
                  </div>
                )
              ) : (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-colors hover:bg-white/10 ${
                      location.pathname === item.path
                        ? "bg-white/20 text-white"
                        : ""
                    }`}
                    onClick={closeMobileSidebar}
                  >
                    <item.icon size={24} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </motion.div>
              )
            )}
          </div>

          {/* Logout button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login"
              className="flex items-center gap-4 px-4 py-3 rounded-lg mb-4 hover:bg-white/10 transition-colors"
              onClick={closeMobileSidebar}
            >
              <LogOut size={24} />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
