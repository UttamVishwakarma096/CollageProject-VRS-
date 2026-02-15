import { useState } from "react";
import { useLocation } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";
import CarGrid from "../components/CarGrid";

const AllVehicles = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    brand: location.state?.brand ?? "",
    fuel: "",
    price: "",
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      <div className="w-70 border-r border-zinc-700 p-4">
        <FilterPanel filters={filters} setFilters={setFilters} />
      </div>

      <div className="flex-1 p-6">
        <CarGrid filters={filters} />
      </div>
    </div>
  );
};

export default AllVehicles;
