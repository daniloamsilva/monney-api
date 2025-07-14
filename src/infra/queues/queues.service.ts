import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QueueType } from './queues.enum';

@Injectable()
export class QueuesService {
  private readonly queueMap: Map<QueueType, Queue>;

  constructor(
    @InjectQueue(QueueType.CONFIRMATION_EMAIL)
    private readonly confirmationEmailQueue: Queue,
    @InjectQueue(QueueType.PASSWORD_RESET_EMAIL)
    private readonly passwordResetEmailQueue: Queue,
  ) {
    this.queueMap = new Map<QueueType, Queue>([
      [QueueType.CONFIRMATION_EMAIL, this.confirmationEmailQueue],
      [QueueType.PASSWORD_RESET_EMAIL, this.passwordResetEmailQueue],
    ]);
  }

  async execute(data: { userId: string; queueType: QueueType }) {
    const { userId, queueType } = data;
    const queue = this.queueMap.get(queueType);

    if (!queue) {
      throw new UnprocessableEntityException(`Queue not found: ${queueType}`);
    }

    await queue.add(`task-${queueType}-${Date.now()}`, { userId });
  }
}
