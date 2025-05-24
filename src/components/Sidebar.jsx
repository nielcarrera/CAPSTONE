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

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: BarChart2, label: "Dashboard", path: "/lp" },
    {
      icon: BarChart2,
      label: "Comprehensive Analysis",
      path: "/db",
      subItems: [
        { label: "Face", path: "/db" },
        { label: "Body", path: "/body" },
      ],
    },
    { icon: User, label: "My Skin Type", path: "/skintype" },
    { icon: Recycle, label: "My Routines", path: "/routine" },
    { icon: PillBottle, label: "My Products", path: "/product" },
    { icon: Package, label: "Product Recommendations", path: "/prodrecco" },
    { section: "Preferences" },

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

  // Auto-close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Auto-open submenu if current route is in subItems
  useEffect(() => {
    const currentItem = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => location.pathname === subItem.path)
    );
    if (currentItem) {
      setOpenSubMenu(true);
    }
  }, [location.pathname]);

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
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isMobile ? 240 : isCollapsed ? 80 : 280,
          x: isMobileOpen || !isMobile ? 0 : -280,
        }}
        className={`fixed left-0 top-0 h-screen bg-[#1A1F2C] text-white flex flex-col z-30 ${
          className || ""
        }`}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mt-5 flex items-center p-6 justify-between">
          {(!isCollapsed || isMobile) && (
            <h1 className="font-bold text-2xl">Insecurity Free</h1>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? <Menu size={24} /> : <X size={24} />}
            </button>
          )}
        </div>

        <nav className="flex-1 mt-10 px-4 flex flex-col overflow-y-auto scrollbar-none">
          <style>{`
            .scrollbar-none::-webkit-scrollbar { display: none; }
            .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
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

                  {/* Submenu items */}
                  {item.subItems &&
                    (openSubMenu || isCollapsed) &&
                    (!isCollapsed || isMobile) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: openSubMenu ? "auto" : 0,
                          opacity: openSubMenu ? 1 : 0,
                        }}
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
                              style={{ paddingLeft: "3.5rem" }}
                            >
                              {(!isCollapsed || isMobile) && (
                                <span>{subItem.label}</span>
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                </div>
              )
            )}
          </div>

          {/* Logout button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login"
              className="flex items-center gap-4 px-4 py-3 rounded-lg mb-4 hover:bg-white/10 transition-colors"
            >
              <LogOut size={24} />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
