import { getQueueToken } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { Queues } from './queues.enum';

@Global()
@Module({
  providers: [
    {
      provide: getQueueToken(Queues.CONFIRMATION_EMAIL),
      useValue: { add: jest.fn() },
    },
  ],
  exports: [getQueueToken(Queues.CONFIRMATION_EMAIL)],
})
export class QueuesTestModule {}
