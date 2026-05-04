import { MemoryProductsRepository } from "./memory/productsRepository.js";
import { MemorySalesRepository } from "./memory/salesRepository.js";
import { MysqlProductsRepository } from "./mysql/productsRepository.js";
import { MysqlSalesRepository } from "./mysql/salesRepository.js";
import { createMysqlPool } from "./mysql/connection.js";

export async function createRepositories(env) {
  const requestedMode = env.storageMode.toLowerCase();

  if (requestedMode === "memory") {
    return {
      mode: "memory",
      productsRepository: new MemoryProductsRepository(),
      salesRepository: new MemorySalesRepository()
    };
  }

  try {
    const pool = await createMysqlPool(env.mysql);

    return {
      mode: "mysql",
      pool,
      productsRepository: new MysqlProductsRepository(pool),
      salesRepository: new MysqlSalesRepository(pool)
    };
  } catch (error) {
    if (requestedMode === "mysql") {
      throw error;
    }

    return {
      mode: "memory",
      fallbackReason: error.message,
      productsRepository: new MemoryProductsRepository(),
      salesRepository: new MemorySalesRepository()
    };
  }
}
