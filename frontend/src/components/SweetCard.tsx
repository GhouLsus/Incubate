import type { Sweet } from "../types/sweet";

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string) => void;
  purchaseDisabled?: boolean;
}

const SweetCard = ({ sweet, onPurchase, purchaseDisabled }: SweetCardProps) => {
  return (
    <div data-cy={`sweet-card-${sweet.id}`} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{sweet.name}</h3>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          {sweet.category}
        </span>
      </div>
      {sweet.description && <p className="mt-2 text-sm text-slate-600">{sweet.description}</p>}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-slate-900">${sweet.price.toFixed(2)}</span>
        <span data-cy="sweet-quantity" className="text-sm text-slate-500">
          Stock: {sweet.quantity}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onPurchase(sweet.id)}
        disabled={purchaseDisabled || sweet.quantity < 1}
        data-cy="sweet-purchase-button"
        className="mt-4 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
      >
        {sweet.quantity > 0 ? "Purchase" : "Out of stock"}
      </button>
    </div>
  );
};

export default SweetCard;
