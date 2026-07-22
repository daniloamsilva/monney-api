import { Inject } from '@nestjs/common';

import { WalletsRepositoryInterface } from './wallets.repository.interface';
import { DatabaseService } from '@/infra/database/database.service';
import { Wallet } from '@/entities/wallet/wallet.entity';
import { mapSnakeToCamel } from '@/utils/map-snake-to-camel';

export class WalletsPostgresRepository implements WalletsRepositoryInterface {
  constructor(
    @Inject(DatabaseService)
    private readonly database: DatabaseService,
  ) {}

  async save(wallet: Wallet): Promise<Wallet> {
    const findWallet = (await this.findByUserId(wallet.userId)).find(
      (w) => w.id === wallet.id,
    );

    let query = '';
    let values = [];

    if (findWallet) {
      query = `
        UPDATE wallets
        SET
          user_id = $1,
          name = $2,
          initial_balance = $3,
          is_default = $4,
          updated_at = $5
        WHERE id = $6
        RETURNING *;
      `;

      values = [
        wallet.userId,
        wallet.name,
        wallet.initialBalance,
        wallet.isDefault,
        wallet.updatedAt,
        findWallet.id,
      ];
    } else {
      query = `
        INSERT INTO wallets (user_id, name, initial_balance, is_default, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      values = [
        wallet.userId,
        wallet.name,
        wallet.initialBalance,
        wallet.isDefault,
        wallet.createdAt,
        wallet.updatedAt,
      ];
    }

    const rows = await this.database.query(query, values);
    return new Wallet(mapSnakeToCamel(rows[0]));
  }

  async findByUserId(userId: string): Promise<Wallet[]> {
    const rows = await this.database.query(
      `
        SELECT * FROM wallets
        WHERE user_id = $1
        AND deleted_at IS NULL;
      `,
      [userId],
    );

    return rows.map((row) => new Wallet(mapSnakeToCamel(row)));
  }
}
