import dotenv from "dotenv";

// Carrega variaveis do arquivo .env para process.env antes da leitura.
dotenv.config();

export function getEnv() {
  return {
    // Define defaults seguros para desenvolvimento local.
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3333),
    storageMode: process.env.STORAGE_MODE ?? "auto",
    authSecret: process.env.AUTH_SECRET ?? "pdv-dev-auth-secret",
    mysql: {
      // Agrupa configuracoes de banco para manter consumo mais simples no restante do codigo.
      host: process.env.MYSQL_HOST ?? "localhost",
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER ?? "root",
      password: process.env.MYSQL_PASSWORD ?? "",
      database: process.env.MYSQL_DATABASE ?? "pdv_supermercado"
    }
  };
}
