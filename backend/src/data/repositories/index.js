import { MemoryProductsRepository } from "./memory/productsRepository.js";
import { MemorySalesRepository } from "./memory/salesRepository.js";
import { MemoryUsersRepository } from "./memory/usersRepository.js";
import { MysqlProductsRepository } from "./mysql/productsRepository.js";
import { MysqlSalesRepository } from "./mysql/salesRepository.js";
import { MysqlUsersRepository } from "./mysql/usersRepository.js";
import { createMysqlPool } from "./mysql/connection.js";

export async function createRepositories(env) {
  const requestedMode = env.storageMode.toLowerCase();

  if (requestedMode === "memory") {
    // Modo explicito em memoria: ideal para testes e demos locais.
    return {
      mode: "memory",
      productsRepository: new MemoryProductsRepository(),
      salesRepository: new MemorySalesRepository(),
      usersRepository: new MemoryUsersRepository()
    };
  }

  try {
    // Em auto ou mysql, tenta abrir conexao real primeiro.
    const pool = await createMysqlPool(env.mysql);

    return {
      mode: "mysql",
      pool,
      productsRepository: new MysqlProductsRepository(pool),
      salesRepository: new MysqlSalesRepository(pool),
      usersRepository: new MysqlUsersRepository(pool)
    };
  } catch (error) {
    if (requestedMode === "mysql") {
      // Se o usuario exigiu MySQL, falhamos em vez de esconder o problema.
      throw error;
    }

    // Em modo auto, caimos para memoria para nao impedir o uso da aplicacao.
    return {
      mode: "memory",
      fallbackReason: error.message,
      productsRepository: new MemoryProductsRepository(),
      salesRepository: new MemorySalesRepository(),
      usersRepository: new MemoryUsersRepository()
    };
  }
}
