import { Global, Module } from '@nestjs/common';

import { ConfirmationEmailController } from './use-cases/confirmation-email/confirmation-email.controller';
import { ConfirmationEmailService } from './use-cases/confirmation-email/confirmation-email.service';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';
import { Providers } from '@/repositories/providers.enum';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';
import { SendEmailService } from './use-cases/send-email/send-email.service';
import { ResendEmailController } from './use-cases/resend-email/resend-email.controller';
import { ResendEmailService } from './use-cases/resend-email/resend-email.service';

@Global()
@Module({
  controllers: [ConfirmationEmailController, ResendEmailController],
  providers: [
    SendEmailService,
    ConfirmationEmailService,
    ResendEmailService,
    {
      provide: Providers.USERS_REPOSITORY,
      useClass: UsersPostgresRepository,
    },
    {
      provide: Providers.TOKENS_REPOSITORY,
      useClass: TokensPostgresRepository,
    },
  ],
  exports: [SendEmailService],
})
export class TokensModule {}
