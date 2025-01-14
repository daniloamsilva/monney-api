import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';
import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Providers } from '../../providers.enum';
import { Queues } from '@/models/queues/queues.enum';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @InjectQueue(Queues.CONFIRMATION_EMAIL)
    private readonly confirmationEmailQueue: Queue,
  ) {}

  async execute(data: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    await this.usersRepository.save(user);
    console.log('estamos aqui', user);

    await this.confirmationEmailQueue.add(
      `send-confirmation-${user.id}-${Date.now()}`,
      { user },
    );

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }
}
