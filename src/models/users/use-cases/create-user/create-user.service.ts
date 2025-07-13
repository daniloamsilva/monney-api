import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';
import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Providers } from '@/repositories/providers.enum';
import { QueuesService } from '@/infra/queues/queues.service';
import { QueueType } from '@/infra/queues/queues.enum';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly queuesService: QueuesService,
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

    await this.queuesService.execute({
      userId: user.id,
      queueType: QueueType.CONFIRMATION_EMAIL,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    };
  }
}
