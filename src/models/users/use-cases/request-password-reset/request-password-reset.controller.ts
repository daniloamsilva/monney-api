import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RequestPasswordResetService } from './request-password-reset.service';
import { RequestPasswordResetRequestDto } from './request-password-reset.request.dto';
import { Public } from '@/decorators/public-route.decorator';

@ApiTags('Users')
@Public()
@Controller('users')
export class RequestPasswordResetController {
  constructor(
    private readonly requestPasswordResetService: RequestPasswordResetService,
  ) {}

  @ApiOperation({ summary: 'Request password reset' })
  @ApiCreatedResponse({
    description: 'Password reset email sent successfully',
    example: {
      statusCode: HttpStatus.CREATED,
      message: 'Password reset email sent successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['email must be an email'],
      error: 'Bad Request',
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found',
    },
  })
  @Post('request-password-reset')
  async handle(@Body() data: RequestPasswordResetRequestDto) {
    return this.requestPasswordResetService.execute(data);
  }
}
