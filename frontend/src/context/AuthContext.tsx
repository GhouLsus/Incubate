// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";
import api from "../api/axiosClient";

type User = { email: string; role?: string } | null;

type AuthCtx = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (payload: { name?: string; email: string; password: string }) => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attach token to axios
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const access = res.data.access_token || res.data.accessToken || res.data.token;
      const usr = res.data.user ?? { email };
      setToken(access);
      setUser(usr);
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(usr));
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { name?: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await registerApi(payload);
      // optionally auto-login
      await login(payload.email, payload.password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
