import type { NextPage } from "next";
import Head from "next/head";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SweetCard from "../components/SweetCard";
import { useAuth } from "../hooks/useAuth";
import { fetchSweets, purchaseSweet, searchSweets } from "../api/sweets";
import type { Sweet } from "../types/sweet";

const HomePage: NextPage = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({ name: "", category: "" });

  const sweetsQuery = useQuery({
    queryKey: ["sweets"],
    queryFn: fetchSweets
  });

  const purchaseMutation = useMutation({
    mutationFn: (id: string) => purchaseSweet(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Sweet[]>(["sweets"], (current) =>
        current?.map((sweet) => (sweet.id === id ? { ...sweet, quantity: sweet.quantity - 1 } : sweet)) ?? []
      );
    }
  });

  const searchMutation = useMutation({
    mutationFn: () =>
      searchSweets({
        name: filters.name || undefined,
        category: filters.category || undefined
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["sweets"], data);
    }
  });

  const handlePurchase = (id: string) => {
    if (!isAuthenticated) return;
    purchaseMutation.mutate(id);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchMutation.mutate();
  };

  return (
    <>
      <Head>
        <title>Sweet Shop - Browse</title>
      </Head>
      <div className="space-y-8">
        <section className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-10 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Discover Sweet Delights</h1>
          <p className="mt-2 max-w-2xl text-sm text-purple-100">
            Browse our collection of handmade sweets. Sign in to purchase your favourites and, if you&apos;re an admin,
            manage the inventory effortlessly.
          </p>
        </section>

        <form onSubmit={handleSearch} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          <input
            name="name"
            placeholder="Search by name"
            value={filters.name}
            onChange={(event) => setFilters((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded-md border border-slate-200 px-3 py-2"
          />
          <input
            name="category"
            placeholder="Filter by category"
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            className="rounded-md border border-slate-200 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Search
          </button>
        </form>

        {sweetsQuery.isLoading && <p className="text-slate-500">Loading sweets...</p>}
        {sweetsQuery.isError && (
          <p className="text-red-600">Unable to load sweets. Please try again later.</p>
        )}

        {sweetsQuery.data && sweetsQuery.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sweetsQuery.data.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={isAuthenticated ? handlePurchase : undefined}
                purchaseDisabled={purchaseMutation.isPending}
              />
            ))}
          </div>
        ) : (
          !sweetsQuery.isLoading && <p className="text-slate-500">No sweets found.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
