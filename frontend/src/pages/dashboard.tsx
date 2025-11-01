import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

const DashboardPage: NextPage = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Head>
        <title>Sweet Shop - Dashboard</title>
      </Head>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Welcome back, {user?.name}! Manage your sweet adventures from here.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-slate-900">Browse Sweets</h2>
            <p className="mt-2 text-sm text-slate-500">Explore the latest treats and see what&apos;s in stock.</p>
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin/sweets"
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-slate-900">Manage Inventory</h2>
              <p className="mt-2 text-sm text-slate-500">Create, update, restock, or remove sweets from the catalogue.</p>
            </Link>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
