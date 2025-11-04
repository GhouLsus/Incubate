// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur sticky top-0 z-30 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">Sweet Shop</Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm">Home</Link>
          {user?.role === "admin" && <Link to="/admin" className="text-sm">Admin</Link>}
          {!user ? (
            <>
              <Link to="/login" className="btn-sm px-3 py-1 bg-indigo-600 text-white rounded">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          ) : (
            <>
              <div className="text-sm">{user.email}</div>
              <button className="btn-sm px-3 py-1 bg-rose-500 text-white rounded" onClick={() => { logout(); nav("/"); }}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
