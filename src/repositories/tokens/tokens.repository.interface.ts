import { Token } from '@/entities/token/token.entity';

export interface TokensRepositoryInterface {
  save(token: Token): Promise<Token>;
  findByToken(token: string): Promise<Token | undefined>;
}
