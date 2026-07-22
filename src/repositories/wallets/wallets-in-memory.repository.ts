import { v7 as uuid } from 'uuid';

import { WalletsRepositoryInterface } from './wallets.repository.interface';
import { Wallet } from '@/entities/wallet/wallet.entity';

export class WalletsInMemoryRepository implements WalletsRepositoryInterface {
  private wallets: Wallet[] = [];

  async save(wallet: Wallet): Promise<Wallet> {
    if (wallet.id) {
      const index = this.wallets.findIndex((w) => w.id === wallet.id);
      this.wallets[index] = wallet;
    } else {
      wallet.id = uuid();
      this.wallets.push(wallet);
    }

    return wallet;
  }

  async findByUserId(userId: string): Promise<Wallet[]> {
    return this.wallets.filter(
      (wallet) => wallet.userId === userId && !wallet.deletedAt,
    );
  }
}
