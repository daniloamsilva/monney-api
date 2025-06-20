import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DatabaseTransactionInterceptor } from '@/interceptors/database-transaction.interceptor';
import { ResendEmailRequestDto } from './resend-email.request.dto';
import { ResendEmailService } from './resend-email.service';
import { Payload } from '@/decorators/payload.decorator';

@ApiTags('Tokens')
@ApiBearerAuth()
@Controller('tokens')
@UseInterceptors(DatabaseTransactionInterceptor)
export class ResendEmailController {
  constructor(private readonly resendEmailService: ResendEmailService) {}

  @ApiOperation({ summary: 'Resend token email' })
  @ApiOkResponse({
    description: 'Email resent successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('resend-email')
  async handle(
    @Payload('sub') userId: string,
    @Body() { tokenType }: ResendEmailRequestDto,
  ) {
    return this.resendEmailService.execute(userId, { tokenType });
  }
}
