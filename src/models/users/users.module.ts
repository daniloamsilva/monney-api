import { Module } from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';

import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { UpdateNameController } from './use-cases/update-name/update-name.controller';
import { UpdatePasswordController } from './use-cases/update-password/update-password.controller';
import { GetUserController } from './use-cases/get-user/get-user.controller';

import { CreateUserService } from './use-cases/create-user/create-user.service';
import { UpdateNameService } from './use-cases/update-name/update-name.service';
import { UpdatePasswordService } from './use-cases/update-password/update-password.service';
import { GetUserService } from './use-cases/get-user/get-user.service';

import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';

@Module({
  controllers: [
    CreateUserController,
    UpdateNameController,
    UpdatePasswordController,
    GetUserController,
  ],
  providers: [
    CreateUserService,
    UpdateNameService,
    UpdatePasswordService,
    GetUserService,
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
