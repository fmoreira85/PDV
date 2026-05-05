import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Ativa o plugin oficial para compilar JSX e integrar React ao Vite.
  plugins: [react()],
  server: {
    // Porta padrao do frontend durante o desenvolvimento local.
    port: 5173
  }
});
