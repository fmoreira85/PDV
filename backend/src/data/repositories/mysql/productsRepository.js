function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    barcode: row.barcode,
    price: Number(row.price),
    stock: row.stock
  };
}

export class MysqlProductsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async list(search = "") {
    const normalized = `%${search.trim()}%`;
    const hasSearch = search.trim().length > 0;

    const [rows] = await this.pool.query(
      `
        SELECT id, name, category, barcode, price, stock
        FROM products
        WHERE (:hasSearch = 0)
           OR name LIKE :search
           OR category LIKE :search
           OR barcode LIKE :search
        ORDER BY name ASC
      `,
      { hasSearch: hasSearch ? 1 : 0, search: normalized }
    );

    return rows.map(mapProduct);
  }

  async findByIds(ids) {
    if (ids.length === 0) {
      return [];
    }

    const [rows] = await this.pool.query(
      `
        SELECT id, name, category, barcode, price, stock
        FROM products
        WHERE id IN (?)
      `,
      [ids]
    );

    return rows.map(mapProduct);
  }

  async decrementStock(items) {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      for (const item of items) {
        const [rows] = await connection.query(
          "SELECT id, name, stock FROM products WHERE id = ? FOR UPDATE",
          [item.productId]
        );

        const product = rows[0];

        if (!product) {
          throw new Error(`Produto ${item.productId} nao encontrado.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}.`);
        }

        await connection.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
          item.quantity,
          item.productId
        ]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
