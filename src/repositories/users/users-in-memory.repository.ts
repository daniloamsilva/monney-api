import { v7 as uuid } from 'uuid';

import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';

type Wallet = {
  id: string;
  userId: string;
  name: string;
  initialBalance: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class UsersInMemoryRepository implements UsersRepositoryInterface {
  private users: User[] = [];
  private wallets: Wallet[] = [];

  constructor(
    private readonly options: { failOnDefaultWalletCreation?: boolean } = {},
  ) {}

  async save(user: User): Promise<User> {
    if (user.id) {
      const index = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = user;
    } else {
      user.id = uuid();
      await user.changePassword(user.password);

      if (this.options.failOnDefaultWalletCreation) {
        throw new Error('Default wallet creation failed');
      }

      this.users.push(user);
      this.wallets.push({
        id: uuid(),
        userId: user.id,
        name: 'Carteira',
        initialBalance: 0,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id && !user.deletedAt);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email && !user.deletedAt);
  }

  findDefaultWalletByUserId(userId: string): Wallet | undefined {
    return this.wallets.find(
      (wallet) => wallet.userId === userId && wallet.isDefault,
    );
  }
}
