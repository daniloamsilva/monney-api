import { Module } from '@nestjs/common';

import { LoginController } from './use-cases/login/login.controller';
import { LoginService } from './use-cases/login/login.service';
import { Providers } from '@/repositories/providers.enum';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';

@Module({
  controllers: [LoginController],
  providers: [
    LoginService,
    {
      provide: Providers.USERS_REPOSITORY,
      useClass: UsersPostgresRepository,
    },
  ],
})
export class AuthModule {}
