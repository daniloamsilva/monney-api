import { HttpStatus } from '@nestjs/common';
import { Queue } from 'bullmq';

import { RequestPasswordResetService } from './request-password-reset.service';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { SendEmailService } from '@/models/tokens/use-cases/send-email/send-email.service';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenType } from '@/entities/token/token.entity';

describe('RequestPasswordResetService', () => {
  let requestPasswordResetService: RequestPasswordResetService;
  let usersRepository: UsersRepositoryInterface;
  let tokensRepository: TokensRepositoryInterface;
  let sendEmailService: SendEmailService;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();
    sendEmailService = new SendEmailService(usersRepository, tokensRepository, {
      add: jest.fn(),
    } as unknown as Queue);

    requestPasswordResetService = new RequestPasswordResetService(
      usersRepository,
      sendEmailService,
    );
  });

  it('should not able to request password reset if user does not exist', async () => {
    await expect(
      requestPasswordResetService.execute('non-exiting-user-email'),
    ).rejects.toThrow('User not found');
  });

  it('should be able to request password reset', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const result = await requestPasswordResetService.execute(user.email);

    const token = await tokensRepository.findValidTokensByUserIdAndType(
      user.id,
      TokenType.PASSWORD_RESET,
    );

    expect(result).toEqual({
      statusCode: HttpStatus.CREATED,
      message: 'Password reset email sent successfully',
    });
    expect(token.length).toBe(1);
  });
});
