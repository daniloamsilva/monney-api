import { fakerPT_BR as faker } from '@faker-js/faker';

import { Token, TokenType } from './token.entity';

export class TokenFactory {
  static create(override?: Partial<Token>): Token {
    const createdAt = override?.createdAt ?? faker.date.past();

    return new Token(
      Object.assign(
        {
          userId: faker.string.uuid(),
          token: faker.string.uuid(),
          type: faker.helpers.arrayElement(Object.values(TokenType)),
          createdAt,
          updatedAt: createdAt,
          deletedAt: null,
        },
        override,
      ),
    );
  }
}
