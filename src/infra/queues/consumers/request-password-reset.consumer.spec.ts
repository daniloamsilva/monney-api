import { Job } from 'bullmq';

import { MailerService } from '@/infra/mailer/mailer.service';
import { RequestPasswordResetConsumer } from './request-password-reset.consumer';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenType } from '@/entities/token/token.entity';

describe('RequestPasswordResetConsumer', () => {
  let requestPasswordResetConsumer: RequestPasswordResetConsumer;
  let mailerService: MailerService;
  let usersRepository: UsersRepositoryInterface;
  let tokensRepository: TokensRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();

    mailerService = {
      sendMail: jest.fn(),
    } as unknown as MailerService;

    requestPasswordResetConsumer = new RequestPasswordResetConsumer(
      mailerService,
      usersRepository,
      tokensRepository,
    );
  });

  it('should be able to to send a password reset email', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const job = { data: { userId: user.id } };

    await requestPasswordResetConsumer.process(job as Job);

    const validTokens = await tokensRepository.findValidTokensByUserIdAndType(
      user.id,
      TokenType.PASSWORD_RESET,
    );

    const token = validTokens[0];

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      recipients: [{ address: user.email, name: user.name }],
      subject: `Redefinição de senha da ${process.env.MAIL_FROM_NAME}`,
      template: 'password-reset',
      context: {
        name: user.name,
        resetLink: `${process.env.APP_URL}/reset-password?token=${token.token}`,
        from: process.env.MAIL_FROM_NAME,
      },
    });
  });
});
