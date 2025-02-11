import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, User, Clock, Settings, HelpCircle, LogOut, Menu } from 'lucide-react';

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: BarChart2, label: 'Comprehensive Analysis', active: true },
    { icon: User, label: 'My Skin Type' },
    { icon: Clock, label: 'Analysis History' },
    { section: 'Preferences' },
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'My Profile' },
    { icon: HelpCircle, label: "FAQ'S" },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={`fixed left-0 top-0 h-screen bg-[#1A1F2C] text-white flex flex-col transition-all duration-300 ${className || ''}`}
    >
      <div className="mt-27 flex items-center p-6 justify-between">
        <h1 className={`font-bold text-2xl ${isCollapsed ? 'hidden' : ''}`}>
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
          {menuItems.map((item, index) => (
            item.section ? (
              <div key={index} className="px-4 py-2 text-sm text-gray-400 mt-4">
                {item.section}
              </div>
            ) : (
              <motion.a
                key={index}
                href="#"
                className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  item.active ? 'bg-gray-400 w-full' : 'hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon size={24} />
                {!isCollapsed && <span>{item.label}</span>}
              </motion.a>
            )
          ))}
        </div>
        
        {/* Logout button at bottom */}
        <motion.a
          href="/login"
          className="flex items-center gap-4 px-4 py-3 rounded-lg mb-4 hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={24} />
          {!isCollapsed && <span>Logout</span>}
        </motion.a>
      </nav>
    </motion.div>
  );
};

export default Sidebar;