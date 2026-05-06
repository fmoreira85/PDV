function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

export class MysqlUsersRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(userData) {
    const [result] = await this.pool.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `,
      [userData.name, userData.email, userData.passwordHash]
    );

    const [rows] = await this.pool.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
    return mapUser(rows[0]);
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0] ? mapUser(rows[0]) : null;
  }

  async findById(userId) {
    const [rows] = await this.pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);
    return rows[0] ? mapUser(rows[0]) : null;
  }
}
