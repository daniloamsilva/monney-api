import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from './infra/database/database.module';
import { QueuesModule } from './infra/queues/queues.module';
import { MailerModuler } from './infra/mailer/mailer.module';
import { AuthGuard } from './guards/auth.guard';

import { AuthModule } from './models/auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { TokensModule } from './models/tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    QueuesModule,
    MailerModuler,

    AuthModule,
    UsersModule,
    TokensModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
