// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Sweet {
//   id: number;
//   name: string;
//   category?: string;
//   description: string;
//   price: number;
//   quantity: number;
//   created_at?: string;
// }

// const Dashboard: React.FC = () => {
//   const [sweets, setSweets] = useState<Sweet[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   const authAxios = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const fetchSweets = async () => {
//     setLoading(true);
//     try {
//       const res = await authAxios.get("/api/sweets/");
//       setSweets(res.data);
//     } catch (err) {
//       console.error("Error fetching sweets:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePurchase = async (id: number) => {
//     try {
//       await authAxios.post("/api/sweets/purchase", { sweet_id: id });
//       alert("Sweet purchased successfully!");
//       fetchSweets();
//     } catch (err) {
//       console.error("Purchase error:", err);
//       alert("Failed to purchase sweet (Unauthorized or Server Error)");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const filteredSweets = sweets.filter((sweet) =>
//     sweet.name.toLowerCase().includes(search.toLowerCase())
//   );

//   useEffect(() => {
//     fetchSweets();
//   }, []);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 p-10 text-white">
//       {/* Header */}
//       <div className="flex flex-col items-center mb-10 relative">
//         <button
//           onClick={handleLogout}
//           className="absolute right-0 top-0 bg-white/20 px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition"
//         >
//           Logout
//         </button>
//         <h1 className="text-5xl font-extrabold text-center drop-shadow-lg mb-3">
//           Welcome to Sweet Bliss
//         </h1>
//         <p className="text-center text-white/80 text-lg max-w-2xl">
//           Indulge your taste buds with the finest collection of traditional and
//           modern sweets. Experience the joy of sweetness, all in one place.
//         </p>
//       </div>

//       {/* Search Bar */}
//       <div className="max-w-xl mx-auto mb-10">
//         <input
//           type="text"
//           placeholder="Search sweets..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-md"
//         />
//       </div>

//       {/* Sweets Grid */}
//       {loading ? (
//         <p className="text-center text-white/80">Loading sweets...</p>
//       ) : filteredSweets.length === 0 ? (
//         <p className="text-center text-white/70 text-lg">
//           No sweets found matching your search 🍬
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredSweets.map((s) => (
//             <div
//               key={s.id}
//               className="card-sparkle bg-linear-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition duration-300"
//             >
//               <img
//                 src={`https://source.unsplash.com/featured/?indian-sweets,${encodeURIComponent(
//                   s.name
//                 )}`}
//                 alt={s.name}
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src =
//                     "https://picsum.photos/seed/fallback-sweet/200/150";
//                 }}
//                 className="w-full h-32 object-cover rounded-xl mb-3 shadow-md transition-transform duration-300 hover:scale-105 hover:brightness-110"
//               />


//               <p className="text-xs text-pink-300 font-semibold uppercase tracking-widest mb-2">
//                 {s.category || "Uncategorized"}
//               </p>
//               <h3 className="text-2xl font-extrabold text-white drop-shadow">
//                 {s.name}
//               </h3>
//               <p className="text-sm text-white/70 mt-2">{s.description}</p>
//               <p className="mt-3 text-lg font-semibold text-yellow-200">
//                 ₹{s.price.toFixed(2)}
//               </p>

//               <p
//                 className={`mt-1 text-sm font-semibold ${s.quantity > 0 ? "text-green-300" : "text-red-400"
//                   }`}
//               >
//                 {s.quantity > 0 ? `${s.quantity} in stock` : "Out of stock"}
//               </p>

//               <button
//                 onClick={() => handlePurchase(s.id)}
//                 disabled={s.quantity === 0}
//                 className={`mt-4 w-full py-2 rounded-xl font-semibold transition ${s.quantity > 0
//                   ? "bg-linear-to-r from-purple-400 to-pink-500 hover:opacity-90"
//                   : "bg-gray-500 cursor-not-allowed opacity-50"
//                   }`}
//               >
//                 {s.quantity > 0 ? "Purchase" : "Out of Stock"}
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Sweet {
  id: number;
  name: string;
  category?: string;
  description: string;
  price: number;
  quantity: number;
  created_at?: string;
}

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const authAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/api/sweets/");
      setSweets(res.data);
    } catch (err) {
      console.error("Error fetching sweets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id: number) => {
    try {
      await authAxios.post("/api/sweets/purchase", { sweet_id: id });
      alert("Sweet purchased successfully!");
      fetchSweets();
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Failed to purchase sweet (Unauthorized or Server Error)");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredSweets = sweets.filter((sweet) =>
    sweet.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 p-10 text-white">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 relative">
        <button
          onClick={handleLogout}
          className="absolute right-0 top-0 bg-white/20 px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition"
        >
          Logout
        </button>
        <h1 className="text-5xl font-extrabold text-center drop-shadow-lg mb-3">
          Welcome to Sweet Bliss 🍭
        </h1>
        <p className="text-center text-white/80 text-lg max-w-2xl">
          Indulge your taste buds with the finest collection of traditional and
          modern sweets. Experience the joy of sweetness, all in one place.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-md"
        />
      </div>

      {/* Sweets Grid */}
      {loading ? (
        <p className="text-center text-white/80">Loading sweets...</p>
      ) : filteredSweets.length === 0 ? (
        <p className="text-center text-white/70 text-lg">
          No sweets found matching your search 🍬
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSweets.map((s) => (
            <div
              key={s.id}
              className="card-sparkle bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition duration-300"
            >
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(
                  s.name
                )}/400/250`}
                alt={s.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://picsum.photos/seed/fallback-sweet/400/250";
                }}
                className="w-full h-40 object-cover rounded-xl mb-3 shadow-md transition-transform duration-300 hover:scale-105 hover:brightness-110"
              />

              <p className="text-xs text-pink-300 font-semibold uppercase tracking-widest mb-2">
                {s.category || "Uncategorized"}
              </p>
              <h3 className="text-2xl font-extrabold text-white drop-shadow">
                {s.name}
              </h3>
              <p className="text-sm text-white/70 mt-2">{s.description}</p>
              <p className="mt-3 text-lg font-semibold text-yellow-200">
                ₹{s.price.toFixed(2)}
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${
                  s.quantity > 0 ? "text-green-300" : "text-red-400"
                }`}
              >
                {s.quantity > 0 ? `${s.quantity} in stock` : "Out of stock"}
              </p>

              <button
                onClick={() => handlePurchase(s.id)}
                disabled={s.quantity === 0}
                className={`mt-4 w-full py-2 rounded-xl font-semibold transition ${
                  s.quantity > 0
                    ? "bg-gradient-to-r from-purple-400 to-pink-500 hover:opacity-90"
                    : "bg-gray-500 cursor-not-allowed opacity-50"
                }`}
              >
                {s.quantity > 0 ? "Purchase" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
