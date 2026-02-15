import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "./CarCard";

const PER_PAGE = 9;

const CarGrid = ({ filters }) => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/cars");
        setCars(res.data.vehicles || []);
      } catch (err) {
        console.error("Error fetching cars", err);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter((car) => {
    return (
      (!filters.brand || car.brand === filters.brand) &&
      (!filters.fuel || car.fuelType === filters.fuel) &&
      (!filters.price || car.price <= filters.price)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / PER_PAGE));
  const start = (currentPage - 1) * PER_PAGE;
  const paginatedCars = filteredCars.slice(start, start + PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.brand, filters.fuel, filters.price]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  return (
    <div className="flex flex-col min-h-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedCars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>

      {filteredCars.length === 0 ? (
        <div className="py-12 text-center text-zinc-400">
          No vehicles match your filters.
        </div>
      ) : totalPages > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`min-w-10 py-2 px-3 rounded-lg font-medium transition ${
                  p === currentPage
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CarGrid;
