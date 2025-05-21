//todo: navbar
// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { name: "Service", to: "/service" },
    { name: "About us", to: "/about" },
    { name: "Sign in", to: "/signin" },
    { name: "Sign up", to: "/signup" },
  ];

  return (
    <nav className="bg-[#251404] px-4 py-2 rounded-full w-max mx-auto mt-4 flex items-center gap-4 shadow-md">
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
    </nav>
  );
};

export default Navbar;
