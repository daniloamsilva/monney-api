import { fakerPT_BR as faker } from '@faker-js/faker';

import { Token, TokenType } from '@src/domain/users/entities/token.entity';

interface TokenFactoryProps {
  id: string;
  type: TokenType;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class TokenFactory {
  static create(override?: Partial<TokenFactoryProps>): Token {
    const type = override?.type ?? TokenType.EMAIL_CONFIRMATION;
    const expiresAt = override?.expiresAt ?? faker.date.future();
    const usedAt = override?.usedAt ?? null;
    const createdAt = override?.createdAt ?? faker.date.past();
    const updatedAt = override?.updatedAt ?? createdAt;
    const deletedAt = override?.deletedAt ?? null;

    return Token.hydrate(
      Object.assign(
        {
          id: faker.string.uuid(),
          type,
          expiresAt,
          usedAt,
          createdAt,
          updatedAt,
          deletedAt,
        },
        override,
      ),
    );
  }
}
