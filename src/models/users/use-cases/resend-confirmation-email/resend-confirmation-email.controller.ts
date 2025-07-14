import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DatabaseTransactionInterceptor } from '@/interceptors/database-transaction.interceptor';
import { ResendConfirmationEmailService } from './resend-confirmation-email.service';
import { Payload } from '@/decorators/payload.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(DatabaseTransactionInterceptor)
export class ResendConfirmationEmailController {
  constructor(
    private readonly resendConfirmationEmailService: ResendConfirmationEmailService,
  ) {}

  @ApiOperation({ summary: 'Resend confirmation email' })
  @ApiOkResponse({
    description: 'Email resent successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'User already confirmed their email',
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'User already confirmed their email',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('resend-confirmation-email')
  async handle(@Payload('sub') userId: string) {
    return this.resendConfirmationEmailService.execute(userId);
  }
}
