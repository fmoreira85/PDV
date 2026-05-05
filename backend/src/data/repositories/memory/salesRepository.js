import { getMemoryState } from "./memoryStore.js";

function isSameDay(dateA, dateB) {
  // Compara apenas a parte YYYY-MM-DD para resumir vendas do mesmo dia.
  return dateA.toISOString().slice(0, 10) === dateB.toISOString().slice(0, 10);
}

export class MemorySalesRepository {
  async createSale(saleData) {
    const state = getMemoryState();
    const saleId = state.nextSaleId++;
    const createdAt = new Date().toISOString();

    // A venda principal guarda apenas os totais; os itens ficam em colecao separada.
    const sale = {
      id: saleId,
      paymentMethod: saleData.paymentMethod,
      amountReceived: saleData.amountReceived,
      totalAmount: saleData.totalAmount,
      changeAmount: saleData.changeAmount,
      createdAt
    };

    state.sales.unshift(sale);

    // Cada item recebe id proprio para espelhar a estrutura relacional do MySQL.
    const items = saleData.items.map((item) => {
      const saleItem = {
        id: state.nextSaleItemId++,
        saleId,
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      };

      state.saleItems.push(saleItem);
      return saleItem;
    });

    return { ...sale, items };
  }

  async getDailySummary(referenceDate = new Date()) {
    const state = getMemoryState();
    const todaySales = state.sales.filter((sale) =>
      isSameDay(new Date(sale.createdAt), referenceDate)
    );

    // Soma o faturamento do dia para alimentar o painel do PDV.
    const totalRevenue = todaySales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

    return {
      salesCount: todaySales.length,
      totalRevenue
    };
  }

  async listHistory() {
    const state = getMemoryState();
    // Reidrata os itens de cada venda para retornar uma estrutura pronta para a UI.
    return state.sales.map((sale) => ({
      ...sale,
      items: state.saleItems
        .filter((item) => item.saleId === sale.id)
        .map((item) => ({ ...item }))
    }));
  }
}
