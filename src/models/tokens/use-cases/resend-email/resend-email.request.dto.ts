import { IsEnum } from 'class-validator';

import { TokenType } from '@/entities/token/token.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailRequestDto {
  @ApiProperty({
    description: 'Type of token to resend',
    enum: TokenType,
    example: TokenType.CONFIRMATION_EMAIL,
  })
  @IsEnum(TokenType, { message: 'Invalid token type' })
  tokenType: TokenType;
}
