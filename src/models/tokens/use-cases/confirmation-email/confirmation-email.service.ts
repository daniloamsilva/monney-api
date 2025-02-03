import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { compareAsc } from 'date-fns';

import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { TokenType } from '@/entities/token/token.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { ConfirmationEmailResponseDto } from './confirmation-email.response.dto';
import { Providers } from '@/repositories/providers.enum';

@Injectable()
export class ConfirmationEmailService {
  constructor(
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(targetToken: string): Promise<ConfirmationEmailResponseDto> {
    const token = await this.tokensRepository.findByToken(targetToken);

    if (!token || token.type !== TokenType.CONFIRMATION_EMAIL) {
      throw new NotFoundException('Token not found');
    }

    const used = token.usedAt;
    const expired = compareAsc(new Date(), token.expiresAt) === 1;

    if (used || expired) {
      throw new NotFoundException('Token not found');
    }

    const confirmedAt = new Date();

    token.usedAt = confirmedAt;
    await this.tokensRepository.save(token);

    const user = await this.usersRepository.findById(token.userId);
    user.confirmedAt = confirmedAt;
    await this.usersRepository.save(user);

    return {
      statusCode: 200,
      message: 'Email confirmed successfully',
    };
  }
}
