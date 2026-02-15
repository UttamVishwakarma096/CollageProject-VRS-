import { Link, NavLink, useLocation } from "react-router-dom";
import Logout from "./Logout";
import { useEffect, useState } from "react";

const Navbar = () => {
  const logout = Logout();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
        : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
    }`;

  return (
    <nav className="bg-zinc-800 border-b border-zinc-700/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-emerald-400 font-bold text-sm sm:text-base md:text-lg tracking-tight hover:text-emerald-300 transition"
          >
            Vehicle Recommendation System
          </Link>

          <div className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/cars" className={navLinkClass}>
              All Vehicles
            </NavLink>
            <NavLink to="/saved_car" className={navLinkClass}>
              Saved Vehicles
            </NavLink>
            <NavLink to="/compare" className={navLinkClass}>
              Compare
            </NavLink>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 hover:bg-zinc-600 hover:text-white font-medium transition border border-zinc-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition border border-emerald-500/50"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
