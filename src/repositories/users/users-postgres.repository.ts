import { Inject } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { DatabaseService } from '@/infra/database/database.service';
import { Encryption } from '@/utils/encryption';
import { mapSnakeToCamel } from '@/utils/mapSnakeToCamel';

export class UsersPostgresRepository implements UsersRepositoryInterface {
  constructor(
    @Inject(DatabaseService)
    private readonly database: DatabaseService,
  ) {}

  async save(user: User): Promise<User> {
    const findUser = await this.findByEmail(user.email);

    let query = '';
    let values = [];

    if (findUser) {
      query = `
        UPDATE users
        SET 
          name = $1,
          email = $2,
          password = $3,
          confirmed_at = $4,
          updated_at = $5
        WHERE id = $6
        RETURNING *; 
      `;

      values = [
        user.name,
        user.email,
        user.password,
        user.confirmedAt,
        user.updatedAt,
        findUser.id,
      ];
    } else {
      user.id = uuid();
      user.password = await Encryption.hash(user.password);

      query = `
        INSERT INTO users (id, name, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      values = [
        user.id,
        user.name,
        user.email,
        user.password,
        user.createdAt,
        user.updatedAt,
      ];
    }

    const rows = await this.database.query(query, values);
    return new User(mapSnakeToCamel(rows[0]));
  }

  async findById(id: string): Promise<User | undefined> {
    const rows = await this.database.query(
      `
        SELECT * FROM users 
        WHERE id = $1
        AND deleted_at IS NULL;
      `,
      [id],
    );

    if (!rows.length) {
      return undefined;
    }

    return new User(mapSnakeToCamel(rows[0]));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const rows = await this.database.query(
      `
        SELECT * FROM users 
        WHERE email = $1
        AND deleted_at IS NULL;
      `,
      [email],
    );

    if (!rows.length) {
      return undefined;
    }

    return new User(mapSnakeToCamel(rows[0]));
  }
}
