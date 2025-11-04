// src/pages/AdminPanel.tsx
import React, { useEffect, useState } from "react";
import { getSweets, createSweet, deleteSweet, updateSweet } from "../api/sweetsApi";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [qty, setQty] = useState<number>(0);
  const { token } = useAuth();

  const load = async () => {
    const res = await getSweets();
    setItems(res.data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    await createSweet({ name, category, price, quantity: qty }, token ?? undefined);
    setName(""); setCategory(""); setPrice(0); setQty(0);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete item?")) return;
    await deleteSweet(id, token ?? undefined);
    await load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin — Sweets</h2>
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="input" />
        <input value={price} onChange={(e) => setPrice(parseFloat(e.target.value || "0"))} placeholder="Price" className="input" />
        <input value={qty} onChange={(e) => setQty(parseInt(e.target.value || "0"))} placeholder="Qty" className="input" />
        <div className="md:col-span-4 flex gap-2">
          <button onClick={add} className="btn-sm bg-green-600 text-white rounded px-4">Add</button>
          <button onClick={load} className="btn-sm border px-4 rounded">Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-slate-500">{it.category}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => remove(it.id)} className="btn-sm bg-rose-600 text-white rounded px-3">Delete</button>
              <button onClick={async () => { await updateSweet(it.id, { ...it, price: it.price + 1 }, token ?? undefined); load(); }} className="btn-sm border px-3 rounded">Inc Price</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
