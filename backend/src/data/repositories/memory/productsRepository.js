import { getMemoryState } from "./memoryStore.js";

function normalizeText(value) {
  // Remove diferencas de caixa e acentuacao para uma busca mais amigavel.
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export class MemoryProductsRepository {
  async list(search = "") {
    const state = getMemoryState();
    const query = normalizeText(search.trim());

    const products = query
      ? state.products.filter((product) => {
          // Monta um texto pesquisavel com nome, categoria e codigo de barras.
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
    // Retorna copias para impedir mutacoes acidentais fora do repositorio.
    return state.products
      .filter((product) => ids.includes(product.id))
      .map((product) => ({ ...product }));
  }

  async decrementStock(items) {
    const state = getMemoryState();

    // Primeiro valida tudo; so depois altera o estado para nao baixar estoque pela metade.
    for (const item of items) {
      const product = state.products.find((entry) => entry.id === item.productId);

      if (!product) {
        throw new Error(`Produto ${item.productId} nao encontrado.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}.`);
      }
    }

    // Com tudo validado, aplica a baixa de estoque.
    for (const item of items) {
      const product = state.products.find((entry) => entry.id === item.productId);
      product.stock -= item.quantity;
    }
  }
}
