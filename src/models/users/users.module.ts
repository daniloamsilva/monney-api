import { Module } from '@nestjs/common';

import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';
import { Providers } from '@/repositories/providers.enum';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';
import { UpdateNameController } from './use-cases/update-name/update-name.controller';
import { UpdateNameService } from './use-cases/update-name/update-name.service';

@Module({
  controllers: [CreateUserController, UpdateNameController],
  providers: [
    CreateUserService,
    UpdateNameService,
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
