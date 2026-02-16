import { Link, NavLink, useLocation } from "react-router-dom";
import Logout from "./Logout";
import { useEffect, useState } from "react";
import { FaCarSide } from "react-icons/fa";

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
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300 transition"
          >
            <FaCarSide className="w-5 h-5" />
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
