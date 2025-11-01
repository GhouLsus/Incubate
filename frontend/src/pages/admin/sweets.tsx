import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import ProtectedRoute from "../../components/ProtectedRoute";
import SweetForm from "../../components/SweetForm";
import Modal from "../../components/Modal";
import { createSweet, deleteSweet, fetchSweets, restockSweet, updateSweet } from "../../api/sweets";
import type { Sweet, SweetInput } from "../../types/sweet";

const AdminSweetsPage: NextPage = () => {
  const queryClient = useQueryClient();
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const sweetsQuery = useQuery({ queryKey: ["sweets"], queryFn: fetchSweets });

  const getErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError) {
      return error.response?.data?.detail ?? error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Something went wrong";
  };

  const createMutation = useMutation({
    mutationFn: (values: SweetInput) => createSweet(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sweets"] });
      toast.success("Sweet created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: SweetInput }) => updateSweet(id, values),
    onSuccess: () => {
      setEditingSweet(null);
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sweets"] });
      toast.success("Sweet updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => restockSweet(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sweets"] });
      toast.success("Stock updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSweet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sweets"] });
      toast.success("Sweet deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleCreate = async (values: SweetInput) => {
    await createMutation.mutateAsync(values);
  };

  const handleUpdate = async (values: SweetInput) => {
    if (!editingSweet) return;
    await updateMutation.mutateAsync({ id: editingSweet.id, values });
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsEditModalOpen(true);
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
                            onClick={() => handleEdit(sweet)}
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
      <Modal
        title={editingSweet ? `Edit Sweet: ${editingSweet.name}` : "Edit Sweet"}
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditingSweet(null);
          setIsEditModalOpen(false);
        }}
      >
        {editingSweet && (
          <SweetForm
            initialValues={editingSweet}
            onSubmit={handleUpdate}
            submitLabel={updateMutation.isPending ? "Updating..." : "Update sweet"}
          />
        )}
      </Modal>
    </ProtectedRoute>
  );
};

export default AdminSweetsPage;
