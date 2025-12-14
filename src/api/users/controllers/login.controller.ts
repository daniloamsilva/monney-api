import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginService } from '@src/application/users/use-cases/login.service';
import { LoginRequestDto } from '@src/application/users/dtos/login-request.dto';
import { LoginResponseDto } from '@src/application/users/dtos/login-response.dto';
import { Public } from '@src/api/shared/decorators/public-route.decorator';

@Public()
@ApiTags('Users')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'Login successful',
    example: {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
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
  @Post()
  async handle(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginService.execute(data);
  }
}
