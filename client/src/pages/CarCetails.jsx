import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCompare } from "./Compare";

const calcEMI = (principal, annualRatePercent, tenureMonths) => {
  if (!principal || principal <= 0 || tenureMonths <= 0) return { emi: 0, total: 0, interest: 0 };
  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - principal;
  return { emi, total, interest };
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("9.5");
  const [tenureYears, setTenureYears] = useState("5");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/car/${id}`);
        setCar(res.data);
      } catch (err) {
        console.error("Error fetching car", err);
      }
    };
    if (id) fetchCar();
  }, [id]);

  useEffect(() => {
    if (car?.price != null && loanAmount === "") {
      setLoanAmount(String(Math.round(car.price * 0.8)));
    }
  }, [car?.price]);

  const principal = Number(loanAmount) || 0;
  const rate = Number(interestRate) || 0;
  const years = Number(tenureYears) || 0;
  const months = years * 12;
  const { emi, total, interest } = calcEMI(principal, rate, months);

  if (!car) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-emerald-400 text-lg">Loading...</div>
      </div>
    );
  }

  const mainImage = car.images?.[0] || car.image;
  const getVal = (v) => (v !== undefined && v !== null && v !== "" ? String(v) : "—");
  const specs = [
    { label: "Brand", value: getVal(car.brand) },
    { label: "Category", value: getVal(car.category) },
    { label: "Fuel type", value: getVal(car.fuelType ?? car.fuel_type) },
    { label: "Transmission", value: getVal(car.transmission) },
    { label: "Seating", value: getVal(car.seatingCapacity ?? car.seating) },
    { label: "Engine", value: getVal(car.engine) },
    { label: "Mileage", value: car.mileage != null ? `${car.mileage} km/l` : "—" },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] bg-zinc-800">
        {mainImage ? (
          <img
            src={mainImage}
            alt={car.name}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <p className="text-emerald-400 font-medium mb-1">{car.brand}</p>
          <h1 className="text-3xl md:text-4xl font-bold">{car.name}</h1>
          <p className="text-2xl font-bold text-emerald-400 mt-2">₹{car.price?.toLocaleString?.() ?? car.price}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Specs grid */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map(({ label, value }) => (
              <div
                key={label}
                className="bg-zinc-800 rounded-xl p-4 border border-zinc-700/80"
              >
                <p className="text-zinc-400 text-sm">{label}</p>
                <p className="text-white font-medium mt-1">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        {car.description && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">About</h2>
            <p className="bg-zinc-800 rounded-xl p-5 border border-zinc-700/80 text-zinc-300 leading-relaxed">
              {car.description}
            </p>
          </section>
        )}

        {/* Features */}
        {car.features?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">Features</h2>
            <div className="flex flex-wrap gap-3">
              {car.features.map((f, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-emerald-500/30 text-emerald-300 text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Colors */}
        {car.colorOptions?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">Colors</h2>
            <div className="flex flex-wrap gap-3">
              {car.colorOptions.map((color, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Rating */}
        {(car.rating > 0 || car.reviewsCount > 0) && (
          <section className="mb-10">
            <div className="flex items-center gap-4 text-zinc-400">
              {car.rating > 0 && (
                <span className="text-emerald-400 font-medium">★ {car.rating}</span>
              )}
              {car.reviewsCount > 0 && (
                <span>{car.reviewsCount} reviews</span>
              )}
            </div>
          </section>
        )}

        {/* EMI Calculator */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">EMI Calculator</h2>
          <div className="bg-zinc-800 rounded-xl border border-zinc-700/80 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Loan amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder={car.price != null ? String(car.price) : "0"}
                  className="w-full bg-zinc-700/80 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Interest rate (% per year)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full bg-zinc-700/80 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Loan tenure (years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  className="w-full bg-zinc-700/80 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-700">
              <div className="bg-zinc-700/50 rounded-lg p-4 text-center">
                <p className="text-zinc-400 text-sm">Monthly EMI</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  ₹{emi > 0 ? Math.round(emi).toLocaleString() : "—"}
                </p>
              </div>
              <div className="bg-zinc-700/50 rounded-lg p-4 text-center">
                <p className="text-zinc-400 text-sm">Total amount</p>
                <p className="text-xl font-bold text-white mt-1">
                  ₹{total > 0 ? Math.round(total).toLocaleString() : "—"}
                </p>
              </div>
              <div className="bg-zinc-700/50 rounded-lg p-4 text-center">
                <p className="text-zinc-400 text-sm">Total interest</p>
                <p className="text-xl font-bold text-amber-400 mt-1">
                  ₹{interest > 0 ? Math.round(interest).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white font-medium transition"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => addToCompare(car._id, navigate)}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition border border-emerald-500/50"
          >
            Add to compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
