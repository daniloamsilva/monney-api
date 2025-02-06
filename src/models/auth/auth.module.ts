import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { LoginController } from './use-cases/login/login.controller';
import { LoginService } from './use-cases/login/login.service';
import { Providers } from '@/repositories/providers.enum';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
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
