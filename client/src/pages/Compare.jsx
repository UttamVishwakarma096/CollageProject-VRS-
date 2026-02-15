import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000/api";
const COMPARE_STORAGE_KEY = "compareCarIds";

const getCompareIds = () => {
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const setCompareIds = (ids) => {
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids.slice(0, 2)));
};

export const addToCompare = (carId, navigate) => {
  const ids = getCompareIds();
  if (ids.includes(carId)) {
    navigate?.("/compare");
    return;
  }
  const next = ids.length >= 2 ? [ids[1], carId] : [...ids, carId];
  setCompareIds(next);
  navigate?.("/compare");
};

const CarSelect = ({ cars, value, onChange, placeholder }) => (
  <select
    value={value || ""}
    onChange={(e) => onChange(e.target.value || null)}
    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
  >
    <option value="">{placeholder}</option>
    {cars.map((c) => (
      <option key={c._id} value={c._id}>
        {c.name} ({c.brand}) — ₹{c.price?.toLocaleString?.() ?? c.price}
      </option>
    ))}
  </select>
);

const SpecRow = ({ label, val1, val2 }) => {
  const v1 = val1 !== undefined && val1 !== null && val1 !== "" ? String(val1) : "—";
  const v2 = val2 !== undefined && val2 !== null && val2 !== "" ? String(val2) : "—";
  return (
    <tr className="border-b border-zinc-700">
      <td className="py-3 px-4 text-zinc-400 font-medium w-1/4">{label}</td>
      <td className="py-3 px-4 text-white">{v1}</td>
      <td className="py-3 px-4 text-white">{v2}</td>
    </tr>
  );
};

const Compare = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [car1Id, setCar1Id] = useState(null);
  const [car2Id, setCar2Id] = useState(null);
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API}/cars`);
        setCars(res.data.vehicles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const ids = getCompareIds();
    if (ids.length) {
      setCar1Id(ids[0] || null);
      setCar2Id(ids[1] || null);
    }
  }, []);

  useEffect(() => {
    if (!car1Id) {
      setCar1(null);
      return;
    }
    axios.get(`${API}/car/${car1Id}`).then((r) => setCar1(r.data)).catch(() => setCar1(null));
  }, [car1Id]);

  useEffect(() => {
    if (!car2Id) {
      setCar2(null);
      return;
    }
    axios.get(`${API}/car/${car2Id}`).then((r) => setCar2(r.data)).catch(() => setCar2(null));
  }, [car2Id]);

  useEffect(() => {
    const ids = [car1Id, car2Id].filter(Boolean);
    setCompareIds(ids);
  }, [car1Id, car2Id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-emerald-400">
        Loading...
      </div>
    );
  }

  const img = (car) => car?.images?.[0] || car?.image;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6">Compare Cars</h1>
        <p className="text-zinc-400 mb-6">Select up to 2 cars to compare side by side.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Car 1</label>
            <CarSelect
              cars={cars}
              value={car1Id}
              onChange={setCar1Id}
              placeholder="Select first car"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Car 2</label>
            <CarSelect
              cars={cars}
              value={car2Id}
              onChange={setCar2Id}
              placeholder="Select second car"
            />
          </div>
        </div>

        {!car1 && !car2 ? (
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-10 text-center text-zinc-400">
            Select two cars above to see the comparison.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
              <thead>
                <tr className="border-b border-zinc-700 bg-zinc-800/80">
                  <th className="py-4 px-4 text-left text-zinc-400 font-semibold w-1/4">Spec</th>
                  <th className="py-4 px-4 text-left font-semibold text-emerald-400">
                    {car1 ? car1.name : "—"}
                  </th>
                  <th className="py-4 px-4 text-left font-semibold text-emerald-400">
                    {car2 ? car2.name : "—"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-700">
                  <td className="py-3 px-4 text-zinc-400 font-medium">Image</td>
                  <td className="py-3 px-4">
                    {car1 && img(car1) ? (
                      <img
                        src={img(car1)}
                        alt={car1.name}
                        className="h-28 w-full max-w-[200px] object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {car2 && img(car2) ? (
                      <img
                        src={img(car2)}
                        alt={car2.name}
                        className="h-28 w-full max-w-[200px] object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
                <SpecRow label="Brand" val1={car1?.brand} val2={car2?.brand} />
                <SpecRow label="Category" val1={car1?.category} val2={car2?.category} />
                <SpecRow label="Price" val1={car1?.price != null ? `₹${Number(car1.price).toLocaleString()}` : null} val2={car2?.price != null ? `₹${Number(car2.price).toLocaleString()}` : null} />
                <SpecRow label="Fuel type" val1={car1?.fuelType ?? car1?.fuel_type} val2={car2?.fuelType ?? car2?.fuel_type} />
                <SpecRow label="Transmission" val1={car1?.transmission} val2={car2?.transmission} />
                <SpecRow label="Seating" val1={car1?.seatingCapacity ?? car1?.seating} val2={car2?.seatingCapacity ?? car2?.seating} />
                <SpecRow label="Engine" val1={car1?.engine} val2={car2?.engine} />
                <SpecRow label="Mileage" val1={car1?.mileage != null ? `${car1.mileage} km/l` : null} val2={car2?.mileage != null ? `${car2.mileage} km/l` : null} />
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
