import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { Queues } from '../queues.enum';
import { User } from '@/entities/user/user.entity';

@Processor(Queues.CONFIRMATION_EMAIL)
export class ConfirmationEmailConsumer extends WorkerHost {
  async process(job: Job<User>): Promise<void> {
    console.log(job);
  }
}
