import { Injectable } from '@nestjs/common';

import { IHandle } from '@src/shared/domain/IDomainEvent';
import { UserCreatedEvent } from '@src/domain/users/events/user-created.event';
import { QueuesService } from '@src/infrastructure/queues/queues.service';
import { QueueType } from '@src/infrastructure/queues/queues.enum';

export const SEND_EMAIL_CONFIRMATION_HANDLER_PROVIDER =
  'SendConfirmationEmailHandler';

@Injectable()
export class SendEmailConfirmationHandler implements IHandle<UserCreatedEvent> {
  constructor(private readonly queuesService: QueuesService) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.queuesService.execute({
      userId: event.aggregateId,
      queueType: QueueType.EMAIL_CONFIRMATION,
    });
  }
}
