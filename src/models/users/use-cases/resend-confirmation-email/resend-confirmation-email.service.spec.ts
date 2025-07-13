import { Queue } from 'bullmq';
import { HttpStatus } from '@nestjs/common';

import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { ResendConfirmationEmailService } from './resend-confirmation-email.service';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenFactory } from '@/entities/token/token.factory';
import { TokenType } from '@/entities/token/token.entity';
import { QueuesService } from '@/infra/queues/queues.service';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';

describe('ResendConfirmationEmailService', () => {
  let resendConfirmationEmailService: ResendConfirmationEmailService;
  let queuesService: QueuesService;
  let tokensRepository: TokensRepositoryInterface;
  let usersRepository: UsersRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();
    queuesService = new QueuesService(
      { add: jest.fn() } as unknown as Queue,
      {} as Queue,
    );

    resendConfirmationEmailService = new ResendConfirmationEmailService(
      tokensRepository,
      usersRepository,
      queuesService,
    );
  });

  it('should not be abel to resend an email if the user already confirmed their email', async () => {
    const user = await usersRepository.save(
      UserFactory.create({ confirmedAt: new Date() }),
    );

    await expect(
      resendConfirmationEmailService.execute(user.id),
    ).rejects.toThrow('User already confirmed their email');
  });

  it('should be able to resend an email with a new token successfully', async () => {
    const user = await usersRepository.save(UserFactory.create());
    await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    const result = await resendConfirmationEmailService.execute(user.id);

    expect(result).toMatchObject({
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    });
  });
});
