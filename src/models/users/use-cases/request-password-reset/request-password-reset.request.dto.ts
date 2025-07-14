import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestPasswordResetRequestDto {
  @ApiProperty({
    description: 'Email address of the user requesting password reset',
    example: 'johndoe@email.com',
  })
  @IsEmail()
  email: string;
}
