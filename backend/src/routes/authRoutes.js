import { Router } from "express";

export function createAuthRoutes(authService, authMiddleware) {
  const router = Router();

  router.post("/register", async (request, response, next) => {
    try {
      const authPayload = await authService.register(request.body);
      response.status(201).json(authPayload);
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (request, response, next) => {
    try {
      const authPayload = await authService.login(request.body);
      response.json(authPayload);
    } catch (error) {
      next(error);
    }
  });

  router.get("/me", authMiddleware, async (request, response) => {
    response.json({ user: request.user });
  });

  return router;
}
