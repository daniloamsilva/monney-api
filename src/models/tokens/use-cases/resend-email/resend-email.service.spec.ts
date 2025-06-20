import { Queue } from 'bullmq';
import { HttpStatus } from '@nestjs/common';

import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { ResendEmailService } from './resend-email.service';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { SendEmailService } from '../send-email/send-email.service';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenFactory } from '@/entities/token/token.factory';
import { TokenType } from '@/entities/token/token.entity';

describe('ResendEmailService', () => {
  let resendEmailService: ResendEmailService;
  let tokensRepository: TokensRepositoryInterface;
  let usersRepository: UsersRepositoryInterface;
  let sendEmailService: SendEmailService;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();
    sendEmailService = new SendEmailService(usersRepository, tokensRepository, {
      add: jest.fn(),
    } as unknown as Queue);

    resendEmailService = new ResendEmailService(
      tokensRepository,
      sendEmailService,
    );
  });

  it('should be able to resend an email with a new token successfully', async () => {
    const user = await usersRepository.save(UserFactory.create());
    await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    const result = await resendEmailService.execute(user.id, {
      tokenType: TokenType.CONFIRMATION_EMAIL,
    });

    expect(result).toMatchObject({
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    });
  });
});
