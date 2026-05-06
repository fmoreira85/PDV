import { getMemoryState } from "./memoryStore.js";

export class MemoryUsersRepository {
  async create(userData) {
    const state = getMemoryState();
    const user = {
      id: state.nextUserId++,
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
      createdAt: new Date().toISOString()
    };

    state.users.push(user);
    return { ...user };
  }

  async findByEmail(email) {
    const state = getMemoryState();
    const user = state.users.find((entry) => entry.email === email);

    return user ? { ...user } : null;
  }

  async findById(userId) {
    const state = getMemoryState();
    const user = state.users.find((entry) => entry.id === userId);

    return user ? { ...user } : null;
  }
}
