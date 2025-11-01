import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ProtectedRoute from "../../components/ProtectedRoute";
import SweetForm from "../../components/SweetForm";
import { createSweet, deleteSweet, fetchSweets, restockSweet, updateSweet } from "../../api/sweets";
import type { Sweet, SweetInput } from "../../types/sweet";

const AdminSweetsPage: NextPage = () => {
  const queryClient = useQueryClient();
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const sweetsQuery = useQuery({ queryKey: ["sweets"], queryFn: fetchSweets });

  const createMutation = useMutation({
    mutationFn: (values: SweetInput) => createSweet(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sweets"] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: SweetInput }) => updateSweet(id, values),
    onSuccess: () => {
      setEditingSweet(null);
      queryClient.invalidateQueries({ queryKey: ["sweets"] });
    }
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => restockSweet(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sweets"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSweet(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sweets"] })
  });

  const handleCreate = async (values: SweetInput) => {
    await createMutation.mutateAsync(values);
  };

  const handleUpdate = async (values: SweetInput) => {
    if (!editingSweet) return;
    await updateMutation.mutateAsync({ id: editingSweet.id, values });
  };

  const handleRestock = (id: string) => {
    restockMutation.mutate({ id, quantity: 10 });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this sweet?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Head>
        <title>Sweet Shop - Admin Inventory</title>
      </Head>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">Sweet Inventory</h1>
          <p className="mt-2 text-sm text-slate-500">Create new sweets, update details, restock, or remove items.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Add New Sweet</h2>
          <SweetForm onSubmit={handleCreate} submitLabel={createMutation.isPending ? "Creating..." : "Create sweet"} />
        </section>

        {editingSweet && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Edit Sweet: {editingSweet.name}</h2>
              <button
                type="button"
                onClick={() => setEditingSweet(null)}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
            <SweetForm
              initialValues={editingSweet}
              onSubmit={handleUpdate}
              submitLabel={updateMutation.isPending ? "Updating..." : "Update sweet"}
            />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Current Inventory</h2>
          {sweetsQuery.isLoading && <p className="text-slate-500">Loading sweets...</p>}
          {sweetsQuery.isError && <p className="text-red-600">Unable to load sweets. Please try again later.</p>}

          {sweetsQuery.data && sweetsQuery.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Sweet
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {sweetsQuery.data.map((sweet) => (
                    <tr key={sweet.id} className="text-sm text-slate-700">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{sweet.name}</div>
                        {sweet.description && <div className="text-xs text-slate-500">{sweet.description}</div>}
                      </td>
                      <td className="px-4 py-3">{sweet.category}</td>
                      <td className="px-4 py-3">${sweet.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{sweet.quantity}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingSweet(sweet)}
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRestock(sweet.id)}
                            disabled={restockMutation.isPending}
                            className="rounded-md border border-purple-200 px-3 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 disabled:opacity-75"
                          >
                            Restock +10
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sweet.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-75"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !sweetsQuery.isLoading && <p className="text-slate-500">No sweets found.</p>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default AdminSweetsPage;
