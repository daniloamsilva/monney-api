import { IsEnum } from 'class-validator';

import { TokenType } from '@/entities/token/token.entity';

export class ResendEmailRequestDto {
  @IsEnum(TokenType, { message: 'Invalid token type' })
  tokenType: TokenType;
}
