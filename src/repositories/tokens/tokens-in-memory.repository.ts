import { v7 as uuid } from 'uuid';
import { add } from 'date-fns';

import { Token } from '@/entities/token/token.entity';
import { TokensRepositoryInterface } from './tokens.repository.interface';

export class TokensInMemoryRepository implements TokensRepositoryInterface {
  private tokens = [];
  private id = 0;

  async save(token: Token): Promise<Token> {
    if (token.id) {
      const index = this.tokens.findIndex((t) => t.id === token.id);
      this.tokens[index] = token;
    } else {
      token.id = this.id + 1;
      token.token = uuid();
      token.expiresAt = token.expiresAt ?? add(new Date(), { days: 7 });

      this.tokens.push(token);
      this.id++;
    }

    return token;
  }

  async findByToken(token: string): Promise<Token | undefined> {
    return this.tokens.find((t) => t.token === token && !t.deletedAt);
  }
}
