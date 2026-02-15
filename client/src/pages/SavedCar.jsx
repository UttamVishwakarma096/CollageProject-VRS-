import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";

const API = "http://localhost:3000/api";

const SavedCar = () => {
  const [savedCars, setSavedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/saved_car`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedCars(Array.isArray(res.data) ? res.data : res.data?.savedCars || []);
    } catch (err) {
      console.error("Error fetching saved cars", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCars();
  }, []);

  const handleRemove = async (carId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`${API}/saved_car`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { carId },
      });
      setSavedCars((prev) =>
        prev.filter((item) => (item.carId?._id ?? item._id)?.toString() !== carId)
      );
    } catch (err) {
      console.error("Error removing saved car", err);
      alert(err.response?.data?.message || "Failed to remove");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Vehicles</h1>

      {savedCars.length === 0 ? (
        <div className="text-center text-zinc-400 mt-20">
          No saved cars yet ❤️
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedCars.map((item) => {
            const car = item.carId || item;
            return (
              <CarCard
                key={car._id}
                car={car}
                showRemoveButton
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedCar;
