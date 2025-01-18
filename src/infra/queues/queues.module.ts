import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { Queues } from './queues.enum';
import { ConfirmationEmailConsumer } from './consumers/confirmation_email.consumer';

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
      ...Object.values(Queues).map((queue) => ({
        name: queue,
      })),
    ),
  ],
  providers: [ConfirmationEmailConsumer],
  exports: [BullModule],
})
export class QueuesModule {}
