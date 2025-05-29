import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#251404] px-4 py-2 rounded-full w-max flex items-center gap-4 shadow-lg">
      <NavLink to="/" className="text-white font-bold px-4 py-2 transition-colors duration-300 hover:bg-[#4F3422] rounded-full">
        Logo
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
  );
};

export default Navbar;
