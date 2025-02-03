import { validate as isUUID } from 'uuid';

import { DatabaseTransactionInterceptor } from '@/interceptors/database-transaction.interceptor';
import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ConfirmationEmailService } from './confirmation-email.service';

@Controller('tokens')
@UseInterceptors(DatabaseTransactionInterceptor)
export class ConfirmationEmailController {
  constructor(
    private readonly confirmationEmailService: ConfirmationEmailService,
  ) {}

  @Patch('confirmation-email/:token')
  async handle(@Param('token') token: string) {
    if (!isUUID(token)) {
      throw new BadRequestException('Invalid token format');
    }

    return this.confirmationEmailService.execute(token);
  }
}
