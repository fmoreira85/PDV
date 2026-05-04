import { createApp } from "./app.js";

const { app, env, repositories } = await createApp();

app.listen(env.port, () => {
  const fallbackNote = repositories.fallbackReason
    ? ` (fallback: ${repositories.fallbackReason})`
    : "";

  console.log(
    `PDV backend rodando na porta ${env.port} usando storage ${repositories.mode}${fallbackNote}`
  );
});
