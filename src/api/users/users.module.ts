import { Module } from '@nestjs/common';

import { Providers } from '@src/infrastructure/repositories/providers.enum';

// Controllers
import { CreateUserController } from './controllers/create-user.controller';

// Services
import { CreateUserService } from '@src/application/users/use-cases/create-user.service';

// Repositories
import { UsersRepository } from '@src/infrastructure/repositories/postgres/users.repository';

@Module({
  imports: [],
  controllers: [CreateUserController],
  providers: [
    CreateUserService,
    {
      provide: Providers.USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
