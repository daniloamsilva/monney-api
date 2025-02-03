import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';
import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Queues } from '@/infra/queues/queues.enum';
import { Token, TokenType } from '@/entities/token/token.entity';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { Providers } from '@/repositories/providers.enum';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
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

    let token = new Token({
      userId: user.id,
      type: TokenType.CONFIRMATION_EMAIL,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    token = await this.tokensRepository.save(token);

    await this.confirmationEmailQueue.add(
      `send-confirmation-${user.id}-${Date.now()}`,
      { user, token },
    );

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }
}
