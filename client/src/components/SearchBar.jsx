import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
      return;
    }

    const results = cars.filter((car) =>
      car.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFiltered(results);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center bg-zinc-700 rounded-full px-4 py-3">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for car..."
          className="bg-transparent outline-none text-white w-full"
        />
      </div>

      {filtered.length > 0 && (
        <div className="absolute top-14 w-full bg-zinc-800 rounded-xl shadow-lg overflow-hidden z-50">
          {filtered.map((car) => (
            <div
              key={car._id}
              onClick={() => navigate(`/car/${car._id}`)}
              className="px-4 py-3 cursor-pointer hover:bg-zinc-700"
            >
              {car.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
