import { Queue } from 'bullmq';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { SendEmailService } from './send-email.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { TokenType } from '@/entities/token/token.entity';
import { UserFactory } from '@/entities/user/user.factory';

describe('SendEmailService', () => {
  let sendEmailService: SendEmailService;
  let usersRepository: UsersRepositoryInterface;
  let tokensRepository: TokensRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();

    sendEmailService = new SendEmailService(usersRepository, tokensRepository, {
      add: jest.fn(),
    } as unknown as Queue);
  });

  it('should not be able to send an email to a non existing user', async () => {
    await expect(
      sendEmailService.execute({
        userId: 'not-found-user',
        tokenType: TokenType.CONFIRMATION_EMAIL,
      }),
    ).rejects.toThrow('User not found');
  });

  it('should be able to send an email successfully', async () => {
    const user = await usersRepository.save(UserFactory.create());

    await sendEmailService.execute({
      userId: user.id,
      tokenType: TokenType.CONFIRMATION_EMAIL,
    });

    const validTokens = await tokensRepository.findValidTokensByUserIdAndType(
      user.id,
      TokenType.CONFIRMATION_EMAIL,
    );

    expect(validTokens).toHaveLength(1);
    expect(validTokens[0].userId).toBe(user.id);
    expect(validTokens[0].type).toBe(TokenType.CONFIRMATION_EMAIL);
  });
});
