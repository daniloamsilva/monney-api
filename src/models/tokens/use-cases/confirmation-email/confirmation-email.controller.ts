import { validate as isUUID } from 'uuid';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DatabaseTransactionInterceptor } from '@/interceptors/database-transaction.interceptor';
import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ConfirmationEmailService } from './confirmation-email.service';

@ApiTags('Tokens')
@Controller('tokens')
@UseInterceptors(DatabaseTransactionInterceptor)
export class ConfirmationEmailController {
  constructor(
    private readonly confirmationEmailService: ConfirmationEmailService,
  ) {}

  @ApiOperation({ summary: 'Confirm an user email' })
  @ApiOkResponse({
    description: 'Email confirmed successfully',
    example: {
      statusCode: 200,
      message: 'Email confirmed successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid token format',
    example: {
      statusCode: 400,
      message: 'Invalid token format',
      error: 'Bad Request',
    },
  })
  @ApiNotFoundResponse({
    description: 'Token not found',
    example: {
      statusCode: 404,
      message: 'Token not found',
      error: 'Not Found',
    },
  })
  @Patch('confirmation-email/:token')
  async handle(@Param('token') token: string) {
    if (!isUUID(token)) {
      throw new BadRequestException('Invalid token format');
    }

    return this.confirmationEmailService.execute(token);
  }
}
