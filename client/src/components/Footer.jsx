import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-800 border-t border-zinc-700/80 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-400 font-bold text-lg mb-3 hover:text-emerald-300 transition"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
                V
              </span>
              VRS
            </Link>
            <p className="text-sm text-zinc-400">
              Find your next vehicle with recommendations you can trust.
            </p>
          </div>
          <div>
            <h3 className="text-emerald-400 font-semibold mb-3">Quick links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="hover:text-emerald-400 transition">
                  All Vehicles
                </Link>
              </li>
              <li>
                <Link to="/saved_car" className="hover:text-emerald-400 transition">
                  Saved Vehicles
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-emerald-400 font-semibold mb-3">Contact</h3>
            <p className="text-sm text-zinc-400">
              Vehicle Recommendation System
              <br />
              Built with care.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-700 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} All rights reserved to Uttam Vishwakarma.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
