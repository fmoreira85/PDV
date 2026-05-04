const supportedPaymentMethods = ["dinheiro", "credito", "debito", "pix"];

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function assertSalePayload(payload) {
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error("A venda precisa ter pelo menos um item.");
  }

  if (!supportedPaymentMethods.includes(payload.paymentMethod)) {
    throw new Error("Forma de pagamento invalida.");
  }

  for (const item of payload.items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new Error("Produto invalido na venda.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantidade invalida na venda.");
    }
  }
}

export class SalesService {
  constructor({ productsRepository, salesRepository }) {
    this.productsRepository = productsRepository;
    this.salesRepository = salesRepository;
  }

  async listProducts(search = "") {
    return this.productsRepository.list(search);
  }

  async getDailySummary() {
    return this.salesRepository.getDailySummary();
  }

  async listHistory() {
    return this.salesRepository.listHistory();
  }

  async createSale(payload) {
    assertSalePayload(payload);

    const productIds = payload.items.map((item) => item.productId);
    const products = await this.productsRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new Error("Nem todos os produtos da venda foram encontrados.");
    }

    const items = payload.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const subtotal = roundCurrency(product.price * item.quantity);

      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantity: item.quantity,
        unitPrice: roundCurrency(product.price),
        subtotal
      };
    });

    const totalAmount = roundCurrency(
      items.reduce((sum, item) => sum + item.subtotal, 0)
    );

    const amountReceived =
      payload.paymentMethod === "dinheiro"
        ? roundCurrency(payload.amountReceived ?? 0)
        : totalAmount;

    if (payload.paymentMethod === "dinheiro" && amountReceived < totalAmount) {
      throw new Error("Valor recebido insuficiente para pagamento em dinheiro.");
    }

    const changeAmount =
      payload.paymentMethod === "dinheiro"
        ? roundCurrency(amountReceived - totalAmount)
        : 0;

    await this.productsRepository.decrementStock(
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    );

    return this.salesRepository.createSale({
      paymentMethod: payload.paymentMethod,
      amountReceived,
      totalAmount,
      changeAmount,
      items
    });
  }
}
