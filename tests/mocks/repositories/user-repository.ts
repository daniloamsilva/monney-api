import { User } from '@src/users/domain/entities/User';
import { IUserRepository } from '@src/users/domain/repositories/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
