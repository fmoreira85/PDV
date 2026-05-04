function mapSale(row) {
  return {
    id: row.id,
    paymentMethod: row.payment_method,
    amountReceived: Number(row.amount_received),
    totalAmount: Number(row.total_amount),
    changeAmount: Number(row.change_amount),
    createdAt: row.created_at
  };
}

export class MysqlSalesRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async createSale(saleData) {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const [saleResult] = await connection.query(
        `
          INSERT INTO sales (payment_method, amount_received, total_amount, change_amount)
          VALUES (?, ?, ?, ?)
        `,
        [
          saleData.paymentMethod,
          saleData.amountReceived,
          saleData.totalAmount,
          saleData.changeAmount
        ]
      );

      const saleId = saleResult.insertId;

      for (const item of saleData.items) {
        await connection.query(
          `
            INSERT INTO sale_items
              (sale_id, product_id, product_name, category, quantity, unit_price, subtotal)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            saleId,
            item.productId,
            item.productName,
            item.category,
            item.quantity,
            item.unitPrice,
            item.subtotal
          ]
        );
      }

      const [saleRows] = await connection.query("SELECT * FROM sales WHERE id = ?", [saleId]);
      const [itemRows] = await connection.query(
        "SELECT * FROM sale_items WHERE sale_id = ? ORDER BY id ASC",
        [saleId]
      );

      await connection.commit();

      return {
        ...mapSale(saleRows[0]),
        items: itemRows.map((row) => ({
          id: row.id,
          saleId: row.sale_id,
          productId: row.product_id,
          productName: row.product_name,
          category: row.category,
          quantity: row.quantity,
          unitPrice: Number(row.unit_price),
          subtotal: Number(row.subtotal)
        }))
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getDailySummary() {
    const [rows] = await this.pool.query(
      `
        SELECT COUNT(*) AS salesCount, COALESCE(SUM(total_amount), 0) AS totalRevenue
        FROM sales
        WHERE DATE(created_at) = CURDATE()
      `
    );

    return {
      salesCount: rows[0].salesCount,
      totalRevenue: Number(rows[0].totalRevenue)
    };
  }

  async listHistory() {
    const [salesRows] = await this.pool.query(
      "SELECT * FROM sales ORDER BY created_at DESC, id DESC"
    );
    const [itemRows] = await this.pool.query(
      "SELECT * FROM sale_items ORDER BY sale_id DESC, id ASC"
    );

    return salesRows.map((saleRow) => ({
      ...mapSale(saleRow),
      items: itemRows
        .filter((item) => item.sale_id === saleRow.id)
        .map((item) => ({
          id: item.id,
          saleId: item.sale_id,
          productId: item.product_id,
          productName: item.product_name,
          category: item.category,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price),
          subtotal: Number(item.subtotal)
        }))
    }));
  }
}
