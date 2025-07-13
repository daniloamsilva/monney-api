import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { ResendConfirmationEmailResponseDto } from './resend-confirmation-email.response.dto';
import { QueuesService } from '@/infra/queues/queues.service';
import { QueueType } from '@/infra/queues/queues.enum';
import { TokenType } from '@/entities/token/token.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';

@Injectable()
export class ResendConfirmationEmailService {
  constructor(
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly queuesService: QueuesService,
  ) {}

  async execute(userId: string): Promise<ResendConfirmationEmailResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user.confirmedAt) {
      throw new BadRequestException('User already confirmed their email');
    }

    const oldTokens =
      await this.tokensRepository.findValidTokensByUserIdAndType(
        userId,
        TokenType.CONFIRMATION_EMAIL,
      );

    if (oldTokens.length) {
      await Promise.all(
        oldTokens.map((token) => {
          token.deletedAt = new Date();
          return this.tokensRepository.save(token);
        }),
      );
    }

    await this.queuesService.execute({
      userId,
      queueType: QueueType.CONFIRMATION_EMAIL,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    };
  }
}
