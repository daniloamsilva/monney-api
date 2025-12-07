import { Module } from '@nestjs/common';

import { DomainEvent } from '@src/domain/shared/DomainEvent';

// Controllers
import { CreateUserController } from './controllers/create-user.controller';

// Services
import { CreateUserService } from '@src/application/users/use-cases/create-user.service';

// Repositories
import {
  USERS_REPOSITORY_PROVIDER,
  UsersRepository,
} from '@src/infrastructure/repositories/postgres/users.repository';

// Events
import { UserCreatedEvent } from '@src/domain/users/events/user-created.event';

// Event Handlers
import {
  SEND_EMAIL_CONFIRMATION_HANDLER_PROVIDER,
  SendEmailConfirmationHandler,
} from '@src/infrastructure/event-handlers/send-email-confirmation.handler';

@Module({
  imports: [],
  controllers: [CreateUserController],
  providers: [
    // Services
    CreateUserService,

    // Repositories
    {
      provide: USERS_REPOSITORY_PROVIDER,
      useClass: UsersRepository,
    },

    // Event Handlers
    SendEmailConfirmationHandler,
    {
      provide: SEND_EMAIL_CONFIRMATION_HANDLER_PROVIDER,
      useFactory: (handler: SendEmailConfirmationHandler) => {
        DomainEvent.register(handler, UserCreatedEvent.name);
        return handler;
      },
      inject: [SendEmailConfirmationHandler],
    },
  ],
})
export class UsersModule {}
