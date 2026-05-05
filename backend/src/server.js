import { createApp } from "./app.js";

// Monta a aplicacao completa antes de iniciar o listener HTTP.
const { app, env, repositories } = await createApp();

app.listen(env.port, () => {
  // Informa se o backend caiu para memoria quando o MySQL nao estiver disponivel.
  const fallbackNote = repositories.fallbackReason
    ? ` (fallback: ${repositories.fallbackReason})`
    : "";

  console.log(
    `PDV backend rodando na porta ${env.port} usando storage ${repositories.mode}${fallbackNote}`
  );
});
