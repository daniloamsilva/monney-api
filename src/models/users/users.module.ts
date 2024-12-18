import { Module } from '@nestjs/common';

import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { Providers } from './providers.enum';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';

@Module({
  controllers: [CreateUserController],
  providers: [
    CreateUserService,
    {
      provide: Providers.USERS_REPOSITORY,
      useClass: UsersInMemoryRepository,
    },
  ],
})
export class UsersModule {}
