import { Inject } from '@nestjs/common';
import { v7 as uuid } from 'uuid';
import { add } from 'date-fns';

import { Token } from '@/entities/token/token.entity';
import { TokensRepositoryInterface } from './tokens.repository.interface';
import { DatabaseService } from '@/infra/database/database.service';

export class TokensPostgresRepository implements TokensRepositoryInterface {
  constructor(
    @Inject(DatabaseService)
    private readonly database: DatabaseService,
  ) {}

  async save(token: Token): Promise<Token> {
    const findToken = await this.findByToken(token.token);

    let query = '';
    let values = [];

    if (findToken) {
      query = `
        UPDATE tokens
        SET
          user_id = $1,
          token = $2,
          type = $3,
          used_at = $4,
          expires_at = $5,
          updated_at = $6
        WHERE id = $7
        RETURNING *;
      `;

      values = [
        token.userId,
        token.token,
        token.type,
        token.usedAt,
        token.expiresAt,
        token.updatedAt,
        findToken.id,
      ];
    } else {
      token.token = uuid();
      token.expiresAt = token.expiresAt ?? add(new Date(), { days: 7 });

      query = `
        INSERT INTO tokens (user_id, token, type, expires_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      values = [
        token.userId,
        token.token,
        token.type,
        token.expiresAt,
        token.createdAt,
        token.updatedAt,
      ];
    }

    const rows = await this.database.query(query, values);
    return new Token(rows[0]);
  }

  async findByToken(token: string): Promise<Token> {
    const rows = await this.database.query(
      `
        SELECT * FROM tokens
        WHERE token = $1
        AND deleted_at IS NULL;
      `,
      [token],
    );

    if (!rows.length) {
      return null;
    }

    return new Token(rows[0]);
  }
}
