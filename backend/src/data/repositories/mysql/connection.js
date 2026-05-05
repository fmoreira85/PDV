import mysql from "mysql2/promise";

export async function createMysqlPool(config) {
  // O pool reaproveita conexoes e reduz custo de abertura a cada request.
  const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    decimalNumbers: true
  });

  // Valida a conexao no startup para detectar falhas cedo.
  await pool.query("SELECT 1");
  return pool;
}
