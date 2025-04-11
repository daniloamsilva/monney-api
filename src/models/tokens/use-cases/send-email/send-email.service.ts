import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { Token } from '@/entities/token/token.entity';
import { Providers } from '@/repositories/providers.enum';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { Queues } from '@/infra/queues/queues.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { SendEmailRequestDto } from './send-email.request.dto';

@Injectable()
export class SendEmailService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
    @InjectQueue(Queues.CONFIRMATION_EMAIL)
    private readonly confirmationEmailQueue: Queue,
  ) {}

  async execute(data: SendEmailRequestDto) {
    const user = await this.usersRepository.findById(data.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let token = new Token({
      userId: data.userId,
      type: data.tokenType,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    token = await this.tokensRepository.save(token);

    await this.confirmationEmailQueue.add(
      `send-confirmation-${data.userId}-${Date.now()}`,
      { user, token },
    );
  }
}
