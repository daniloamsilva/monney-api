import { Token, TokenType } from '@/entities/token/token.entity';

export interface TokensRepositoryInterface {
  save(token: Token): Promise<Token>;
  findByToken(token: string): Promise<Token | undefined>;
  findValidTokensByUserIdAndType(
    userId: string,
    type: TokenType,
  ): Promise<Token[]>;
}
