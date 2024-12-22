import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from '@/utils/match.validator';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'johndoe@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User pasword',
    example: 'pass1234',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User password confirmation',
    example: 'pass1234',
  })
  @IsString()
  @Match('password')
  passwordConfirmation: string;
}
