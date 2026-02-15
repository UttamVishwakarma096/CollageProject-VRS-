const FilterPanel = ({ filters, setFilters }) => {
  const BRANDS = ["", "Tata", "Hyundai", "Maruti", "Honda"];
  const FUELS = ["", "Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
  const PRICE_RANGES = [
    { label: "Any", value: "" },
    { label: "Under 5L", value: 500000 },
    { label: "Under 10L", value: 1000000 },
    { label: "Under 15L", value: 1500000 },
    { label: "Under 20L", value: 2000000 },
    { label: "Under 30L", value: 3000000 },
  ];

  const btnClass = (isActive) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition border ${
      isActive
        ? "bg-emerald-600 border-emerald-500 text-white"
        : "bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
    }`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-emerald-400">Filters</h2>

      {/* Brand */}
      <div>
        <p className="text-zinc-400 text-sm mb-2">Brand</p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button
              key={b || "all"}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, brand: b }))}
              className={btnClass(filters.brand === b)}
            >
              {b || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel */}
      <div>
        <p className="text-zinc-400 text-sm mb-2">Fuel Type</p>
        <div className="flex flex-wrap gap-2">
          {FUELS.map((f) => (
            <button
              key={f || "all"}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, fuel: f }))}
              className={btnClass(filters.fuel === f)}
            >
              {f || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-zinc-400 text-sm mb-2">Max Price</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, price: value }))}
              className={btnClass(
                filters.price === value || (value === "" && !filters.price)
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
