// src/components/SweetCard.tsx
import React from "react";

type Props = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  onPurchase?: (id: string) => void;
};

export default function SweetCard({ id, name, category, price, quantity, onPurchase }: Props) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col justify-between">
      <div>
        <div className="font-semibold text-lg">{name}</div>
        <div className="text-sm text-slate-500">{category}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">₹{price.toFixed(2)}</div>
          <div className="text-sm text-slate-500">Stock: {quantity}</div>
        </div>

        <button
          disabled={quantity <= 0}
          onClick={() => onPurchase?.(id)}
          className={`px-3 py-1 rounded text-white ${quantity > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Purchase
        </button>
      </div>
    </div>
  );
}
