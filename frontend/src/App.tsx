// src/App.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
