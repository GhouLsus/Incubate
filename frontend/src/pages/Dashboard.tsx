// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getSweets, purchaseSweet, searchSweets } from "../api/sweetsApi";
import SweetCard from "../components/SweetCard";
import { useAuth } from "../context/AuthContext";

type Sweet = { id: string; name: string; category: string; price: number; quantity: number };

export default function Dashboard() {
  const [items, setItems] = useState<Sweet[]>([]);
  const [q, setQ] = useState("");
  const { token } = useAuth();

  const load = async () => {
    try {
      const res = await getSweets();
      setItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const doSearch = async () => {
    if (!q) return load();
    const res = await searchSweets({ name: q });
    setItems(res.data);
  };

  const onPurchase = async (id: string) => {
    try {
      await purchaseSweet(id, token ?? undefined);
      await load();
    } catch (e) {
      alert("Purchase failed");
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sweets..." className="flex-1 input" />
        <button onClick={doSearch} className="btn-sm bg-indigo-600 text-white rounded px-4">Search</button>
        <button onClick={load} className="btn-sm px-4 border rounded">Reset</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <SweetCard key={s.id} {...s} onPurchase={onPurchase} />
        ))}
      </div>
    </div>
  );
}
