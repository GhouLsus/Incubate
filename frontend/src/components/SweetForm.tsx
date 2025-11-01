import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { SweetInput, Sweet } from "../types/sweet";

interface SweetFormProps {
  initialValues?: Partial<Sweet>;
  onSubmit: (values: SweetInput) => Promise<void> | void;
  submitLabel?: string;
}

const defaultValues: SweetInput = {
  name: "",
  category: "",
  description: "",
  price: 0,
  quantity: 0
};

const SweetForm = ({ initialValues, onSubmit, submitLabel = "Save" }: SweetFormProps) => {
  const [values, setValues] = useState<SweetInput>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
      price: initialValues?.price ?? defaultValues.price,
      quantity: initialValues?.quantity ?? defaultValues.quantity
    });
  }, [initialValues]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      if (!initialValues) {
        setValues({ ...defaultValues });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            value={values.price}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={0}
            value={values.quantity}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description ?? ""}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:bg-purple-300"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default SweetForm;
