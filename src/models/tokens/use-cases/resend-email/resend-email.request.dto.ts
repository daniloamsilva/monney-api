import { TokenType } from '@/entities/token/token.entity';

export class ResendEmailRequestDto {
  userId: string;
  tokenType: TokenType;
}
