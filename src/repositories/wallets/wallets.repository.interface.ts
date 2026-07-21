import { Wallet } from '@/entities/wallet/wallet.entity';

export interface WalletsRepositoryInterface {
  save(wallet: Wallet): Promise<Wallet>;
  findByUserId(userId: string): Promise<Wallet[]>;
}
