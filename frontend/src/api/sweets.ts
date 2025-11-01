import api from "./axios";
import type { Sweet, SweetInput, SweetUpdateInput } from "../types/sweet";

export const fetchSweets = async (): Promise<Sweet[]> => {
  const { data } = await api.get<Sweet[]>("/sweets");
  return data;
};

export const searchSweets = async (params: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Sweet[]> => {
  const { data } = await api.get<Sweet[]>("/sweets/search", { params });
  return data;
};

export const createSweet = async (payload: SweetInput): Promise<Sweet> => {
  const { data } = await api.post<Sweet>("/sweets", payload);
  return data;
};

export const updateSweet = async (id: string, payload: SweetUpdateInput): Promise<Sweet> => {
  const { data } = await api.put<Sweet>(`/sweets/${id}`, payload);
  return data;
};

export const deleteSweet = async (id: string): Promise<void> => {
  await api.delete(`/sweets/${id}`);
};

export const purchaseSweet = async (id: string): Promise<Sweet> => {
  const { data } = await api.post<Sweet>(`/sweets/${id}/purchase`);
  return data;
};

export const restockSweet = async (id: string, quantity: number): Promise<Sweet> => {
  const { data } = await api.post<Sweet>(`/sweets/${id}/restock`, { quantity });
  return data;
};
