import { Router } from "express";

export function createProductsRoutes(salesService) {
  const router = Router();

  router.get("/", async (request, response, next) => {
    try {
      // Reutiliza o servico para concentrar busca e regras em um unico lugar.
      const products = await salesService.listProducts(request.query.q ?? "");
      response.json(products);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
