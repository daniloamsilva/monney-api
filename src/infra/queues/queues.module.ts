import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QueueType } from './queues.enum';
import { ConfirmationEmailConsumer } from './consumers/confirmation-email.consumer';
import { QueuesService } from './queues.service';
import { Providers } from '@/repositories/providers.enum';
import { UsersPostgresRepository } from '@/repositories/users/users-postgres.repository';
import { TokensPostgresRepository } from '@/repositories/tokens/tokens-postgres.repository';

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
    ConfirmationEmailConsumer,
    {
      provide: Providers.USERS_REPOSITORY,
      useClass: UsersPostgresRepository,
    },
    {
      provide: Providers.TOKENS_REPOSITORY,
      useClass: TokensPostgresRepository,
    },
  ],
  exports: [BullModule, QueuesService],
})
export class QueuesModule {}
