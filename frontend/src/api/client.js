import axios from "axios";

// Permite trocar a URL da API por variavel de ambiente sem mexer no codigo.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

export const api = axios.create({
  // Concentrar a configuracao do cliente HTTP evita repeticao nas chamadas.
  baseURL,
  timeout: 10000
});
