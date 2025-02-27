import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get current route

  const menuItems = [
    { icon: BarChart2, label: "Comprehensive Analysis", path: "/db" },
    { icon: User, label: "My Skin Type", path: "/skintype" },
    { icon: Recycle, label: "My Routines", path: "/routine" },
    { icon: PillBottle, label: "My Products", path: "/product" },
    { section: "Preferences" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: HelpCircle, label: "FAQ'S", path: "/faqs" },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={`fixed left-0 top-0 h-screen bg-[#1A1F2C] text-white flex flex-col transition-all duration-300 ${
        className || ""
      }`}
    >
      <div className="mt-5 flex items-center p-6 justify-between">
        <h1 className={`font-bold text-2xl ${isCollapsed ? "hidden" : ""}`}>
          Insecurity Free
        </h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <nav className="flex-1 mt-10 px-4 flex flex-col">
        <div className="flex-1">
          {menuItems.map((item, index) =>
            item.section ? (
              <div key={index} className="px-4 py-2 text-sm text-gray-400 mt-4">
                {item.section}
              </div>
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
                      ? "bg-white/20 text-white" // Active item styling
                      : ""
                  }`}
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
          >
            <LogOut size={24} />
            {!isCollapsed && <span>Logout</span>}
          </Link>
        </motion.div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
