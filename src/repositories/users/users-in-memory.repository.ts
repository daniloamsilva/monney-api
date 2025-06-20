import { v7 as uuid } from 'uuid';

import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';

export class UsersInMemoryRepository implements UsersRepositoryInterface {
  private users = [];

  async save(user: User): Promise<User> {
    if (user.id) {
      const index = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = user;
    } else {
      user.id = uuid();
      await user.changePassword(user.password);
      this.users.push(user);
    }

    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id && !user.deletedAt);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email && !user.deletedAt);
  }
}
