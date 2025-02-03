import { Module } from '@nestjs/common';

import { ConfirmationEmailController } from './use-cases/confirmation-email/confirmation-email.controller';
import { ConfirmationEmailService } from './use-cases/confirmation-email/confirmation-email.service';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';
import { Providers } from '@/repositories/providers.enum';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';

@Module({
  controllers: [ConfirmationEmailController],
  providers: [
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
})
export class TokensModule {}
