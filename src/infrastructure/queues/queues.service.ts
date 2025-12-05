import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QueueType } from './queues.enum';

@Injectable()
export class QueuesService {
  private readonly queueMap: Map<QueueType, Queue>;

  constructor(
    @InjectQueue(QueueType.EMAIL_CONFIRMATION)
    private readonly confirmationEmailQueue: Queue,
  ) {
    this.queueMap = new Map<QueueType, Queue>([
      [QueueType.EMAIL_CONFIRMATION, this.confirmationEmailQueue],
    ]);
  }

  async execute(data: { userId: string; queueType: QueueType }) {
    const { userId, queueType } = data;
    const queue = this.queueMap.get(queueType);

    if (!queue) {
      throw new UnprocessableEntityException(`Queue not found: ${queueType}`);
    }

    await queue.add(
      `${queueType}`,
      { userId },
      { jobId: `${queueType}-${userId}-${Date.now()}` },
    );
  }
}
