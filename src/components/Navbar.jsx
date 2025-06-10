// PulihHati-Frontend\src\components\Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when navigating
  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Safe Space", to: "/safespace" },
    { name: "About us", to: "/about" },
    { name: "Chatbot", to: "/chatbot" },
  ];

  const authItems = isLoggedIn
    ? [
        { name: "Profile", to: "/profile", icon: User },
      ]
    : [
        { name: "Sign in", to: "/signin" },
        { name: "Sign up", to: "/signup" },
      ];

  return (
    <>
      {/* Hamburger button for mobile */}
      <button 
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#251404] p-2 rounded-full shadow-lg text-white"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile slide-in menu */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#251404] shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col p-4 pt-16">
          <NavLink 
            to="/" 
            className="px-4 py-3 mb-4 transition-colors duration-300 hover:bg-[#4F3422] rounded-full flex items-center justify-center"
            onClick={handleNavigation}
          >
            <img 
              src="/logoNavbar.png" 
              alt="PulihHati Logo" 
              className="h-8 w-auto"
            />
          </NavLink>
          
          {navItems.map(({ name, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `px-4 py-3 mb-2 rounded-full font-medium transition-colors duration-300 ${
                  isActive ? "bg-[#4F3422] text-white shadow" : "text-white hover:bg-[#4F3422]"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
          
          {authItems.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `px-4 py-3 mb-2 rounded-full font-medium transition-colors duration-300 flex items-center gap-2 ${
                  isActive ? "bg-[#4F3422] text-white shadow" : "text-white hover:bg-[#4F3422]"
                }`
              }
            >
              {Icon && <Icon className="w-4 h-4" />}
              {name}
            </NavLink>
          ))}
          
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-3 mt-2 rounded-full font-medium transition-colors duration-300 text-white hover:bg-[#4F3422] flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Desktop navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#251404] px-4 py-2 rounded-full w-max hidden md:flex items-center gap-4 shadow-lg">
        <NavLink 
          to="/" 
          className="px-4 py-2 transition-colors duration-300 hover:bg-[#4F3422] rounded-full flex items-center"
        >
          <img 
            src="/logoNavbar.png" 
            alt="PulihHati Logo" 
            className="h-8 w-auto"
          />
        </NavLink>

        {navItems.map(({ name, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                isActive ? "bg-[#4F3422] text-white shadow" : "text-white hover:bg-[#4F3422]"
              }`
            }
          >
            {name}
          </NavLink>
        ))}

        {authItems.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-medium transition-colors duration-300 flex items-center gap-2 ${
                isActive ? "bg-[#4F3422] text-white shadow" : "text-white hover:bg-[#4F3422]"
              }`
            }
          >
            {Icon && <Icon className="w-4 h-4" />}
            {name}
          </NavLink>
        ))}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full font-medium transition-colors duration-300 text-white hover:bg-[#4F3422] flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </nav>
      
      {/* Overlay to close menu when clicking outside */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;