import { Module } from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';

import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { UpdateNameController } from './use-cases/update-name/update-name.controller';
import { UpdatePasswordController } from './use-cases/update-password/update-password.controller';
import { GetUserController } from './use-cases/get-user/get-user.controller';
import { ConfirmationEmailController } from './use-cases/confirmation-email/confirmation-email.controller';
import { ResendConfirmationEmailController } from './use-cases/resend-confirmation-email/resend-confirmation-email.controller';
import { RequestPasswordResetController } from './use-cases/request-password-reset/request-password-reset.controller';

import { CreateUserService } from './use-cases/create-user/create-user.service';
import { UpdateNameService } from './use-cases/update-name/update-name.service';
import { UpdatePasswordService } from './use-cases/update-password/update-password.service';
import { GetUserService } from './use-cases/get-user/get-user.service';
import { ConfirmationEmailService } from './use-cases/confirmation-email/confirmation-email.service';
import { ResendConfirmationEmailService } from './use-cases/resend-confirmation-email/resend-confirmation-email.service';
import { RequestPasswordResetService } from './use-cases/request-password-reset/request-password-reset.service';

import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';

@Module({
  controllers: [
    CreateUserController,
    UpdateNameController,
    UpdatePasswordController,
    GetUserController,
    ConfirmationEmailController,
    ResendConfirmationEmailController,
    RequestPasswordResetController,
  ],
  providers: [
    CreateUserService,
    UpdateNameService,
    UpdatePasswordService,
    GetUserService,
    ConfirmationEmailService,
    ResendConfirmationEmailService,
    RequestPasswordResetService,
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
export class UsersModule {}
