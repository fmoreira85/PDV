import { Router } from "express";

export function createSalesRoutes(salesService) {
  const router = Router();

  router.get("/summary", async (_request, response, next) => {
    try {
      const summary = await salesService.getDailySummary();
      response.json(summary);
    } catch (error) {
      next(error);
    }
  });

  router.get("/history", async (_request, response, next) => {
    try {
      const history = await salesService.listHistory();
      response.json(history);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const sale = await salesService.createSale(request.body);
      response.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
