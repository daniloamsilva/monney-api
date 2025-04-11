import { TokenType } from '@/entities/token/token.entity';

export type SendEmailRequestDto = {
  userId: string;
  tokenType: TokenType;
};
