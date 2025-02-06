import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginService } from './login.service';
import { LoginRequestDto } from './login.request.dto';
import { LoginResponseDto } from './login.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'User logged in successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: {
        accessToken: 'access-token',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid email or password',
      error: 'Unauthorized',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async handle(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginService.execute(data);
  }
}
