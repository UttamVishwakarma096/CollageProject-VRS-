import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000/api";

const initialFormState = {
  name: "",
  brand: "",
  price: "",
  category: "",
  fuelType: "",
  transmission: "",
  engine: "",
  mileage: "",
  seatingCapacity: "",
  colorOptions: "",
  images: "",
  description: "",
  features: "",
};

const Admin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Prepare payload according to carModel schema
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      category: form.category,
      fuelType: form.fuelType,
      transmission: form.transmission,
      engine: form.engine.trim() || undefined,
      mileage: form.mileage ? Number(form.mileage) : undefined,
      seatingCapacity: Number(form.seatingCapacity),
      colorOptions: form.colorOptions
        ? form.colorOptions.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      images: form.images
        ? form.images.split(",").map((u) => u.trim()).filter(Boolean)
        : [],
      description: form.description.trim() || undefined,
      features: form.features
        ? form.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
    };

    // Basic front-end validation for required fields
    if (
      !payload.name ||
      !payload.brand ||
      !payload.price ||
      !payload.category ||
      !payload.fuelType ||
      !payload.transmission ||
      !payload.seatingCapacity
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/cars`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Vehicle added successfully.");
      setForm(initialFormState);
    } catch (err) {
      console.error("Error adding vehicle", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add vehicle.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-zinc-800/80 border border-zinc-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-zinc-900">
        <h1 className="text-2xl font-bold mb-2">Admin - Add Vehicle</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Add new vehicles to the database using the existing car model schema.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800/80 border border-zinc-700 rounded-2xl p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Tata Nexon EV"
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Tata"
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                min="0"
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Seating Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="seatingCapacity"
                value={form.seatingCapacity}
                onChange={handleChange}
                className={inputClass}
                min="1"
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select category</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="MUV">MUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select fuel type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Transmission <span className="text-red-500">*</span>
              </label>
              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Engine</label>
              <input
                type="text"
                name="engine"
                value={form.engine}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 1.5L Turbo"
              />
            </div>

            <div>
              <label className={labelClass}>Mileage (km/l)</label>
              <input
                type="number"
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                className={inputClass}
                min="0"
                step="0.1"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Image URLs (comma separated)</label>
              <input
                type="text"
                name="images"
                value={form.images}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://..., https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Color Options (comma separated)</label>
              <input
                type="text"
                name="colorOptions"
                value={form.colorOptions}
                onChange={handleChange}
                className={inputClass}
                placeholder="Red, White, Black"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[80px] resize-none`}
              placeholder="Short description about the vehicle..."
            />
          </div>

          <div>
            <label className={labelClass}>Features (comma separated)</label>
            <input
              type="text"
              name="features"
              value={form.features}
              onChange={handleChange}
              className={inputClass}
              placeholder="Airbags, ABS, Sunroof"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForm(initialFormState)}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-zinc-600 text-sm text-zinc-200 hover:bg-zinc-700/60 disabled:opacity-60"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white disabled:bg-zinc-600 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;

