import { api } from "./client";

export async function fetchProducts(search = "", options = {}) {
  const response = await api.get("/products", {
    params: { q: search },
    signal: options.signal
  });

  return response.data;
}

export async function fetchSummary() {
  const response = await api.get("/sales/summary");
  return response.data;
}

export async function fetchHistory() {
  const response = await api.get("/sales/history");
  return response.data;
}

export async function createSale(payload) {
  const response = await api.post("/sales", payload);
  return response.data;
}
