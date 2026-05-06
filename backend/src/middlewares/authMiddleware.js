export function createAuthMiddleware(authService) {
  return async function authMiddleware(request, response, next) {
    try {
      const authorization = request.get("authorization") ?? "";

      if (!authorization.startsWith("Bearer ")) {
        response.status(401).json({ message: "Autenticacao obrigatoria." });
        return;
      }

      const token = authorization.slice("Bearer ".length).trim();
      request.user = await authService.authenticate(token);
      next();
    } catch (error) {
      response.status(401).json({
        message: error.message || "Nao foi possivel validar a sessao."
      });
    }
  };
}
