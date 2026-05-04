import { getMemoryState } from "./memoryStore.js";

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export class MemoryProductsRepository {
  async list(search = "") {
    const state = getMemoryState();
    const query = normalizeText(search.trim());

    const products = query
      ? state.products.filter((product) => {
          const haystack = normalizeText(
            `${product.name} ${product.category} ${product.barcode}`
          );
          return haystack.includes(query);
        })
      : state.products;

    return products.map((product) => ({ ...product }));
  }

  async findByIds(ids) {
    const state = getMemoryState();
    return state.products
      .filter((product) => ids.includes(product.id))
      .map((product) => ({ ...product }));
  }

  async decrementStock(items) {
    const state = getMemoryState();

    for (const item of items) {
      const product = state.products.find((entry) => entry.id === item.productId);

      if (!product) {
        throw new Error(`Produto ${item.productId} nao encontrado.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}.`);
      }
    }

    for (const item of items) {
      const product = state.products.find((entry) => entry.id === item.productId);
      product.stock -= item.quantity;
    }
  }
}
