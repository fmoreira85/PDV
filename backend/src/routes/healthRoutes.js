import { Router } from "express";

export function createHealthRoutes({ mode, fallbackReason }) {
  const router = Router();

  router.get("/", (_request, response) => {
    response.json({
      status: "ok",
      storageMode: mode,
      fallbackReason: fallbackReason ?? null
    });
  });

  return router;
}
