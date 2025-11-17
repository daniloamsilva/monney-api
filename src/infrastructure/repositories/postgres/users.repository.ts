import { Inject, Injectable } from '@nestjs/common';

import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { DatabaseService } from '@src/infrastructure/database/database.service';
import { User } from '@src/domain/users/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @Inject(DatabaseService)
    private readonly database: DatabaseService,
  ) {}

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    const query = `
      INSERT INTO users (id, name, email, password, confirmed_at, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET 
        name = $2,
        email = $3,
        password = $4,
        confirmed_at = $5,
        is_active = $6;
    `;

    const values = [
      data.id,
      data.name,
      data.email,
      data.password,
      data.confirmed_at,
      data.is_active,
    ];

    await this.database.query(query, values);
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.database.query(
      `
        SELECT id, name, email, password, confirmed_at, is_active, created_at, updated_at, deleted_at
        FROM users 
        WHERE id = $1
        AND deleted_at IS NULL;
      `,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    return UserMapper.toDomain(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.database.query(
      `
        SELECT id, name, email, password, confirmed_at, is_active, created_at, updated_at, deleted_at
        FROM users 
        WHERE email = $1
        AND deleted_at IS NULL;
      `,
      [email],
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return UserMapper.toDomain(row);
  }
}
