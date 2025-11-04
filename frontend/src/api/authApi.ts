// src/api/authApi.ts
import api from "./axiosClient";

export const register = (payload: any) => api.post("/auth/register", payload);
export const login = (payload: any) => api.post("/auth/login", payload);
