import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { LoginService } from './login.service';
import { LoginRequestDto } from './login.request.dto';
import { LoginResponseDto } from './login.response.dto';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async handle(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginService.execute(data);
  }
}
