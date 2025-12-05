import { User, UserProps } from '@src/domain/users/entities/user.entity';
import { Email } from '@src/domain/users/value-objects/email.vo';
import { Password } from '@src/domain/users/value-objects/password.vo';
import {
  TokenDbRow,
  TokenMapper,
  ToPersist as TokenToPersist,
} from './token.mapper';

interface UserDbRow {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmed_at: Date | null;
  is_active: boolean;
  tokens: TokenDbRow[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class UserMapper {
  public static toPersistence(user: User): UserDbRow {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      password: user.password.value,
      confirmed_at: user.confirmedAt,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt,

      tokens: user.tokens.map((token) =>
        TokenMapper.toPersistence(
          Object.assign(token, { userId: user.id }) as TokenToPersist,
        ),
      ),
    };
  }

  public static toDomain(raw: UserDbRow): User {
    const userProps: UserProps = {
      id: raw.id,
      name: raw.name,
      email: Email.create(raw.email),
      password: Password.fromHash(raw.password),
      confirmedAt: raw.confirmed_at,
      isActive: raw.is_active,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: raw.deleted_at,

      tokens: raw.tokens?.map((tokenRow) => TokenMapper.toDomain(tokenRow)),
    };

    return User.hydrate(userProps);
  }
}
