import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCompare } from "../pages/Compare";

const API = "http://localhost:3000/api";

const CarCard = ({ car, onRemove, showRemoveButton }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const carId = car._id || car.id;
    if (!carId) {
      setError("Invalid car");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await axios.post(
        `${API}/saved_car`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
    } catch (err) {
      console.error("Error saving car", err);
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = () => navigate(`/car/${car._id || car.id}`);

  return (
    <div className="bg-zinc-800 rounded-xl p-3 hover:scale-[1.02] transition relative flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => (e.key === "Enter" ? handleCardClick() : null)}
        className="cursor-pointer flex-1 min-h-0"
      >
        <img
          src={car.images?.[0] || car.image}
          alt={car.name}
          className="h-32 w-full object-cover rounded-lg"
        />
        <h3 className="mt-2 text-base font-semibold truncate" title={car.name}>{car.name}</h3>
        <p className="text-xs text-zinc-400">{car.brand}</p>
        <p className="mt-0.5 font-bold text-emerald-400 text-sm">₹{car.price?.toLocaleString?.() ?? car.price}</p>
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-700 space-y-1.5" onClick={(e) => e.stopPropagation()}>
        {showRemoveButton && onRemove ? (
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const carId = car._id || car.id;
              if (!carId) return;
              setRemoving(true);
              try {
                await onRemove(carId);
              } finally {
                setRemoving(false);
              }
            }}
            disabled={removing}
            className="w-full py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-xs font-medium transition"
          >
            {removing ? "Removing..." : "Remove from saved"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-xs font-medium transition"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCompare(car._id || car.id, navigate);
          }}
          className="w-full py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-medium transition border border-zinc-600"
        >
          Add to compare
        </button>
        {error && <p className="mt-0.5 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default CarCard;
