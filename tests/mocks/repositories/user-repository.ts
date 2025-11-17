import { User } from '@src/domain/users/entities/user.entity';
import { IUsersRepository } from '@src/domain/users/repositories/user-repository.interface';

export class InMemoryUserRepository implements IUsersRepository {
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
