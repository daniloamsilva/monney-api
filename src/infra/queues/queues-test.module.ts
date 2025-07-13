import { getQueueToken } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { QueueType } from './queues.enum';
import { QueuesService } from './queues.service';

@Global()
@Module({
  providers: [
    QueuesService,
    ...Object.values(QueueType).map((queue) => ({
      provide: getQueueToken(queue),
      useValue: { add: jest.fn() },
    })),
  ],
  exports: [
    QueuesService,
    ...Object.values(QueueType).map((queue) => getQueueToken(queue)),
  ],
})
export class QueuesTestModule {}
