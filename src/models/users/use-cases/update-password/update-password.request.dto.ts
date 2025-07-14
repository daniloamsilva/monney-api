import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Match } from '@/utils/match.validator';

export class UpdatePasswordRequestDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'pass1234',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

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
