import cors from "cors";
import express from "express";

import { getEnv } from "./config/env.js";
import { createRepositories } from "./data/repositories/index.js";
import { createHealthRoutes } from "./routes/healthRoutes.js";
import { createProductsRoutes } from "./routes/productsRoutes.js";
import { createSalesRoutes } from "./routes/salesRoutes.js";
import { SalesService } from "./services/salesService.js";

export async function createApp() {
  const env = getEnv();
  const repositories = await createRepositories(env);
  const salesService = new SalesService(repositories);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      name: "pdv-backend",
      version: "1.0.0",
      storageMode: repositories.mode
    });
  });

  app.use("/api/health", createHealthRoutes(repositories));
  app.use("/api/products", createProductsRoutes(salesService));
  app.use("/api/sales", createSalesRoutes(salesService));

  app.use((error, _request, response, _next) => {
    response.status(400).json({
      message: error.message || "Erro interno no servidor."
    });
  });

  return { app, env, repositories };
}
