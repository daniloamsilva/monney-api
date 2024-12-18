import { IsEmail, IsString, MinLength } from 'class-validator';

import { Match } from '@/utils/match.validator';

export class CreateUserRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Match('password')
  passwordConfirmation: string;
}
