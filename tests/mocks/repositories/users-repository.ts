import { User } from '@src/domain/users/entities/user.entity';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';

export class InMemoryUsersRepository implements IUsersRepository {
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
    const index = this.users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }
}
