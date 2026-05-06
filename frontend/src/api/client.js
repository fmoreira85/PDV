import axios from "axios";

// Permite trocar a URL da API por variavel de ambiente sem mexer no codigo.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

export const api = axios.create({
  // Concentrar a configuracao do cliente HTTP evita repeticao nas chamadas.
  baseURL,
  timeout: 10000
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}
