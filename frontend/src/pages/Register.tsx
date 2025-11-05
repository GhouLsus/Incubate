import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Client-side password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name || null,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 201 || res.status === 200) {
        console.log("✅ Registered successfully:", res.data);
        navigate("/"); // Redirect to login page
      } else {
        setError("Unexpected server response.");
      }
    } catch (err: any) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 p-6">
      <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow">
          Create Account ✨
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name (Optional)"
            value={formData.full_name}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars)"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-linear-to-r from-purple-400 to-pink-500 py-3 rounded-xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-white/70 mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-purple-300 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
