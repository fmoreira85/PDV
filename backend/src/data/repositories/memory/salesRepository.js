import { getMemoryState } from "./memoryStore.js";

function isSameDay(dateA, dateB) {
  return dateA.toISOString().slice(0, 10) === dateB.toISOString().slice(0, 10);
}

export class MemorySalesRepository {
  async createSale(saleData) {
    const state = getMemoryState();
    const saleId = state.nextSaleId++;
    const createdAt = new Date().toISOString();

    const sale = {
      id: saleId,
      paymentMethod: saleData.paymentMethod,
      amountReceived: saleData.amountReceived,
      totalAmount: saleData.totalAmount,
      changeAmount: saleData.changeAmount,
      createdAt
    };

    state.sales.unshift(sale);

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

    const totalRevenue = todaySales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

    return {
      salesCount: todaySales.length,
      totalRevenue
    };
  }

  async listHistory() {
    const state = getMemoryState();
    return state.sales.map((sale) => ({
      ...sale,
      items: state.saleItems
        .filter((item) => item.saleId === sale.id)
        .map((item) => ({ ...item }))
    }));
  }
}
