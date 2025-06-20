import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordRequestDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'currentPassword123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
