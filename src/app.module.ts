import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infra/database/database.module';
import { QueuesModule } from './infra/queues/queues.module';
import { UsersModule } from './models/users/users.module';
import { MailerModuler } from './infra/mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    QueuesModule,
    MailerModuler,
    UsersModule,
  ],
})
export class AppModule {}
