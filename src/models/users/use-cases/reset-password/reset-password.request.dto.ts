import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsUUID } from 'class-validator';

import { Match } from '@/utils/match-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'Token received via email for password reset',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  token: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newPass1234',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'newPass1234',
  })
  @IsString()
  @Match('newPassword')
  newPasswordConfirmation: string;
}
