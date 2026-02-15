import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const BRANDS = ["Tata", "Hyundai", "Maruti", "Honda"];

const Dashboard = () => {
  return (
    <>
      <div className="h-screen bg-zinc-900 text-white flex justify-center items-center relative overflow-hidden">
        {/* Blurred illustration behind search */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Large soft emerald orb */}
          <div className="absolute w-[min(80vw,520px)] h-[min(80vw,520px)] rounded-full bg-emerald-500/30 blur-[100px] -translate-y-8" />
          {/* Secondary orb */}
          <div className="absolute w-72 h-72 rounded-full bg-emerald-400/20 blur-[80px] translate-x-32 translate-y-12" />
          <div className="absolute w-64 h-64 rounded-full bg-zinc-500/20 blur-[70px] -translate-x-40 -translate-y-4" />
          {/* Abstract “road” curve */}
          <div className="absolute w-[140%] h-80 rounded-[50%] border-[80px] border-emerald-500/10 blur-3xl -rotate-12 -translate-y-16" />
          {/* Simple car silhouette (rounded rect + circles) */}
          <div className="absolute w-64 h-24 rounded-4xl bg-emerald-400/15 blur-2xl translate-y-6" />
          <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 blur-xl -translate-x-24 translate-y-8" />
          <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 blur-xl translate-x-24 translate-y-8" />
        </div>
        <div className="relative z-10">
          <SearchBar />
        </div>
      </div>
      <div className="min-h-[50vh] bg-zinc-900 text-white px-6 pb-16">
        <h2 className="text-xl font-semibold text-center pt-10 mb-6">
          Brand suggestion
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              to="/cars"
              state={{ brand }}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
