import cors from "cors";
import express from "express";

import { getEnv } from "./config/env.js";
import { createRepositories } from "./data/repositories/index.js";
import { createAuthMiddleware } from "./middlewares/authMiddleware.js";
import { createAuthRoutes } from "./routes/authRoutes.js";
import { createHealthRoutes } from "./routes/healthRoutes.js";
import { createProductsRoutes } from "./routes/productsRoutes.js";
import { createSalesRoutes } from "./routes/salesRoutes.js";
import { AuthService } from "./services/authService.js";
import { SalesService } from "./services/salesService.js";

export async function createApp() {
  // Centraliza leitura de configuracao para que a criacao da app
  // sempre use a mesma origem de dados e o mesmo modo de storage.
  const env = getEnv();

  // Escolhe entre MySQL e memoria conforme ambiente e disponibilidade.
  const repositories = await createRepositories(env);
  const authService = new AuthService({
    usersRepository: repositories.usersRepository,
    authSecret: env.authSecret
  });

  // A regra de negocio fica em um servico unico usado pelas rotas.
  const salesService = new SalesService(repositories);
  const authMiddleware = createAuthMiddleware(authService);

  const app = express();

  // Habilita chamadas do frontend e parse automatico de JSON.
  app.use(cors());
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      name: "pdv-backend",
      version: "1.0.0",
      storageMode: repositories.mode
    });
  });

  // Cada grupo de endpoints recebe apenas as dependencias que precisa.
  app.use("/api/auth", createAuthRoutes(authService, authMiddleware));
  app.use("/api/health", createHealthRoutes(repositories));
  app.use("/api/products", authMiddleware, createProductsRoutes(salesService));
  app.use("/api/sales", authMiddleware, createSalesRoutes(salesService));

  // Padroniza a resposta de erro sem expor stack trace ao cliente.
  app.use((error, _request, response, _next) => {
    response.status(400).json({
      message: error.message || "Erro interno no servidor."
    });
  });

  return { app, env, repositories };
}
