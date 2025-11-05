import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Sweet {
  id: number;
  name: string;
  category?: string;  // 🆕 Optional because not every sweet must have one
  description: string;
  price: number;
  quantity: number;
  created_at?: string; // 🆕 Optional if you later want to show when it was added
}


const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [newSweet, setNewSweet] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ✅ Always include Bearer token
  const authAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // e.g. http://127.0.0.1:8000/api
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/api/sweets/`);
      setSweets(res.data);
    } catch (err) {
      console.error("Error loading sweets:", err);
      alert("Failed to fetch sweets. Check your token or backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authAxios.post(`/sweets/`, {
        name: newSweet.name,
        description: newSweet.description,
        price: Number(newSweet.price),
        quantity: Number(newSweet.quantity),
      });
      setNewSweet({ name: "", description: "", price: "", quantity: "" });
      fetchSweets();
      alert("Sweet added successfully!");
    } catch (err) {
      console.error("Add Sweet Error:", err);
      alert("Failed to add sweet (Unauthorized or Server Error)");
    }
  };

  const handleRestock = async (id: number) => {
    try {
      await authAxios.post(`/sweets/restock`, { sweet_id: id });
      fetchSweets();
      alert("Sweet restocked successfully!");
    } catch (err) {
      console.error("Restock error:", err);
      alert("Failed to restock (Unauthorized or Server Error)");
    }
  };

  const handleDeleteSweet = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await authAxios.delete(`/api/sweets/${id}`);
      fetchSweets();
      alert("Sweet deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete sweet (Unauthorized or Server Error)");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 p-10 text-white">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 relative">
        <button
          onClick={handleLogout}
          className="absolute right-0 top-0 bg-white/20 px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition"
        >
          Logout
        </button>
        <h1 className="text-5xl font-extrabold text-center drop-shadow-lg">
          Admin Panel 🍭
        </h1>
      </div>

      {/* Add Sweet */}
      <form
        onSubmit={handleAddSweet}
        className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-6 mb-10 max-w-2xl mx-auto shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add New Sweet 🍬
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newSweet.name}
            onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
            required
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={newSweet.price}
            onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
            required
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newSweet.quantity}
            onChange={(e) =>
              setNewSweet({ ...newSweet, quantity: e.target.value })
            }
            required
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            value={newSweet.description}
            onChange={(e) =>
              setNewSweet({ ...newSweet, description: e.target.value })
            }
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300 focus:outline-none col-span-1 sm:col-span-2"
          />
        </div>
        <button
          type="submit"
          className="mt-6 bg-linear-to-r from-pink-400 to-purple-500 py-2 w-full rounded-xl font-bold hover:opacity-90 transition"
        >
          Add Sweet
        </button>
      </form>

      {/* Sweets List */}
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Sweets 🍪</h2>
      {loading ? (
        <p className="text-center text-white/80">Loading sweets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sweets.map((s) => (
            <div
              key={s.id}
              className="card-sparkle bg-linear-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition duration-300"
            >
              <p className="text-xs text-pink-300 font-semibold uppercase tracking-widest mb-2">
                {s.category || "Uncategorized"}
              </p>
              <h3 className="text-2xl font-extrabold text-white drop-shadow">{s.name}</h3>
              <p className="text-sm text-white/70 mt-2">{s.description}</p>
              <p className="mt-3 text-lg font-semibold text-yellow-200">₹{s.price.toFixed(2)}</p>

              <p
                className={`mt-1 text-sm font-semibold ${s.quantity > 0 ? "text-green-300" : "text-red-400"
                  }`}
              >
                {s.quantity > 0 ? `${s.quantity} in stock` : "Out of stock"}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleRestock(s.id)}
                  className="flex-1 bg-linear-to-r from-green-400 to-teal-500 py-2 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Restock
                </button>
                <button
                  onClick={() => handleDeleteSweet(s.id)}
                  className="flex-1 bg-linear-to-r from-red-500 to-pink-600 py-2 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
