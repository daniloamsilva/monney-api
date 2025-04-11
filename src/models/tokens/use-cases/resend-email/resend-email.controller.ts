import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { DatabaseTransactionInterceptor } from '@/interceptors/database-transaction.interceptor';
import { ResendEmailRequestDto } from './resend-email.request.dto';
import { ResendEmailService } from './resend-email.service';
import { Payload } from '@/decorators/payload.decorator';

@Controller()
@UseInterceptors(DatabaseTransactionInterceptor)
export class ResendEmailController {
  constructor(private readonly resendEmailService: ResendEmailService) {}

  @HttpCode(HttpStatus.OK)
  @Post('tokens/resend-email')
  async handle(
    @Payload('sub') userId: string,
    @Body() { tokenType }: ResendEmailRequestDto,
  ) {
    return this.resendEmailService.execute(userId, { tokenType });
  }
}
