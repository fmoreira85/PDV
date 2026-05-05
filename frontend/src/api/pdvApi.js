import { api } from "./client";

export async function fetchProducts(search = "", options = {}) {
  // Encapsula a busca para que os componentes nao conhecam detalhes do axios.
  const response = await api.get("/products", {
    params: { q: search },
    signal: options.signal
  });

  return response.data;
}

export async function fetchSummary() {
  // Busca os indicadores exibidos no topo do PDV.
  const response = await api.get("/sales/summary");
  return response.data;
}

export async function fetchHistory() {
  // Recupera as vendas ja finalizadas para a tela de historico.
  const response = await api.get("/sales/history");
  return response.data;
}

export async function createSale(payload) {
  // Envia a venda montada no carrinho para persistencia no backend.
  const response = await api.post("/sales", payload);
  return response.data;
}
