// src/api/sweetsApi.ts
import api from "./axiosClient";

export const getSweets = () => api.get("/sweets");
export const searchSweets = (params: Record<string, any>) =>
  api.get("/sweets/search", { params });
export const createSweet = (payload: any, token?: string) =>
  api.post("/sweets", payload, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const updateSweet = (id: string, payload: any, token?: string) =>
  api.put(`/sweets/${id}`, payload, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const deleteSweet = (id: string, token?: string) =>
  api.delete(`/sweets/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const purchaseSweet = (id: string, token?: string) =>
  api.post(`/sweets/${id}/purchase`, {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const restockSweet = (id: string, qty: number, token?: string) =>
  api.post(`/sweets/${id}/restock`, { quantity: qty }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
