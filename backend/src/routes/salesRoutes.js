import { Router } from "express";

export function createSalesRoutes(salesService) {
  const router = Router();

  router.get("/summary", async (_request, response, next) => {
    try {
      // Entrega o resumo do dia para alimentar os indicadores do frontend.
      const summary = await salesService.getDailySummary();
      response.json(summary);
    } catch (error) {
      next(error);
    }
  });

  router.get("/history", async (_request, response, next) => {
    try {
      // Retorna vendas completas com itens para a tela de historico.
      const history = await salesService.listHistory();
      response.json(history);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      // Cria a venda e responde com status 201 por se tratar de um novo recurso.
      const sale = await salesService.createSale(request.body);
      response.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
