import { Token, TokenType } from '@/entities/token/token.entity';

export interface TokensRepositoryInterface {
  save(token: Token): Promise<Token>;
  findById(id: number): Promise<Token | undefined>;
  findByToken(token: string): Promise<Token | undefined>;
  findValidTokensByUserIdAndType(
    userId: string,
    type: TokenType,
  ): Promise<Token[]>;
  findValidTokenByTokenAndType(
    token: string,
    type: TokenType,
  ): Promise<Token | undefined>;
}
