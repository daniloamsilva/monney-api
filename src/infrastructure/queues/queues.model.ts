import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QueueType } from './queues.enum';
import { EmailConfirmationConsumer } from './consumers/email-confirmation.consumer';
import {
  USERS_REPOSITORY_PROVIDER,
  UsersRepository,
} from '../repositories/postgres/users.repository';
import { QueuesService } from './queues.service';
import { MailerService } from '../mailer/mailer.service';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue(
      ...Object.values(QueueType).map((queue) => ({
        name: queue,
      })),
    ),
  ],
  providers: [
    QueuesService,
    EmailConfirmationConsumer,
    MailerService,
    {
      provide: USERS_REPOSITORY_PROVIDER,
      useClass: UsersRepository,
    },
  ],
  exports: [BullModule, QueuesService],
})
export class QueuesModule {}
