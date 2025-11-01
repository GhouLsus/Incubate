export interface Sweet {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  created_at: string;
}

export interface SweetInput {
  name: string;
  category: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface SweetUpdateInput {
  name?: string;
  category?: string;
  description?: string | null;
  price?: number;
  quantity?: number;
}
