// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
