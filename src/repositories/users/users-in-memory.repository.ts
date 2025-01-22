import { v7 as uuid } from 'uuid';

import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { Encryption } from '@/utils/encryption';

export class UsersInMemoryRepository implements UsersRepositoryInterface {
  private users = [];

  async save(user: User): Promise<User> {
    user.id = uuid();
    user.password = await Encryption.hash(user.password);

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email && !user.deletedAt);
  }
}
