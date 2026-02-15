import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/signup", newUser);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      setNewUser({ username: "", email: "", password: "" });
      navigate("/", { replace: true });
    } catch (error) {
      alert(error?.response?.data?.message || "Signup failed");
    }
  };

  const handleOnChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "w-full bg-zinc-800/80 border border-zinc-600 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Subtle background - same as Login */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute w-80 h-80 rounded-full bg-zinc-600/10 blur-[80px] -translate-x-32 translate-y-20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Tabs - same structure as Login for smooth transition */}
        <div className="flex rounded-t-xl overflow-hidden bg-zinc-800/60 border border-b-0 border-zinc-700">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex-1 py-4 text-center font-semibold transition ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-700/60 hover:text-white"
              }`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `flex-1 py-4 text-center font-semibold transition ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-700/60 hover:text-white"
              }`
            }
          >
            Sign up
          </NavLink>
        </div>

        {/* Card */}
        <div className="bg-zinc-800/80 backdrop-blur border border-t-0 border-zinc-700 rounded-b-xl shadow-xl px-8 py-8">
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-zinc-400 text-sm mb-6">Join Vehicle Recommendation System</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={newUser.username}
                onChange={handleOnChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={newUser.email}
                onChange={handleOnChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={newUser.password}
                onChange={handleOnChange}
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
