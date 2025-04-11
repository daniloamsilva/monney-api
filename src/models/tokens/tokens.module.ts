import { Global, Module } from '@nestjs/common';

import { ConfirmationEmailController } from './use-cases/confirmation-email/confirmation-email.controller';
import { ConfirmationEmailService } from './use-cases/confirmation-email/confirmation-email.service';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';
import { Providers } from '@/repositories/providers.enum';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';
import { SendEmailService } from './use-cases/send-email/send-email.service';

@Global()
@Module({
  controllers: [ConfirmationEmailController],
  providers: [
    SendEmailService,
    ConfirmationEmailService,
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
