import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import { useLogout } from "../Pages/hooks/hooks";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [];

  return (
    <nav
      className="bg-cyan-900 fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-sm bg-opacity-95"
      style={{
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderTop: "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="w-50 h-37 rounded-2xl"
              style={{ borderRadius: "16px" }}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="text-gray-300 relative px-4 py-2 text-m font-medium transition-all duration-300 
                  hover:text-purple-100 before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:w-0 before:h-[2px] 
                  before:bg-white before:transition-all before:duration-300 before:ease-in-out 
                  hover:before:w-full hover:before:left-0 rounded-lg hover:bg-white/5 px-4 py-2"
                style={{ borderRadius: "12px" }}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Logout Button */}
          <button
            onClick={logout}
            className="hidden md:block bg-gray-800 font-semibold text-white px-6 py-3 rounded-xl text-sm font-medium 
              transition-all duration-300 shadow-sm hover:shadow-md hover:bg-gray-600 
              transform hover:scale-105 active:scale-95 border border-white/10"
            style={{ borderRadius: "14px" }}
          >
            Logout
          </button>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-purple-100 focus:outline-none p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
              style={{ borderRadius: "12px" }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? "max-h-64 opacity-100 pb-4" : "max-h-0 opacity-0"
          } md:hidden transition-all duration-300 ease-in-out overflow-hidden`}
          style={{
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 
                  hover:bg-purple-200 hover:text-purple-900 mx-2"
                style={{ borderRadius: "14px" }}
              >
                {item.title}
              </Link>
            ))}
            <div className="px-2 pt-2">
              <button
                onClick={logout}
                className="text-left bg-gray-900 text-white px-4 py-3 rounded-xl text-base font-medium 
                  transition-all duration-300 hover:bg-gray-700 transform hover:scale-105 active:scale-95 w-full border border-white/10"
                style={{ borderRadius: "14px" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
