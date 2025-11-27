import { getQueueToken } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { QueueType } from '@src/infrastructure/queues/queues.enum';
import { QueuesService } from '@src/infrastructure/queues/queues.service';

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
export class QueuesModule {}
