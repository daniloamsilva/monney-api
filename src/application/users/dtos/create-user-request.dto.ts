import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from '@src/application/shared/validators/match.validator';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'johndoe@email.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'User pasword',
    example: 'pass1234',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, {
    message: 'Password must be longer than or equal to 8 characters',
  })
  password: string;

  @ApiProperty({
    description: 'User password confirmation',
    example: 'pass1234',
  })
  @IsString({ message: 'Password confirmation must be a string' })
  @Match('password', { message: "Passwords don't match" })
  passwordConfirmation: string;
}
