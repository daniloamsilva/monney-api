import { Job } from 'bullmq';

import { MailerService } from '@/infra/mailer/mailer.service';
import { ConfirmationEmailConsumer } from './confirmation-email.consumer';
import { UserFactory } from '@/entities/user/user.factory';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { TokenType } from '@/entities/token/token.entity';

describe('ConfirmationEmailConsumer', () => {
  let confirmationEmailConsumer: ConfirmationEmailConsumer;
  let mailerService: MailerService;
  let usersRepository: UsersRepositoryInterface;
  let tokensRepository: TokensRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();

    mailerService = {
      sendMail: jest.fn(),
    } as unknown as MailerService;

    confirmationEmailConsumer = new ConfirmationEmailConsumer(
      mailerService,
      usersRepository,
      tokensRepository,
    );
  });

  it('should be able to send a confirmation email', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const job = { data: { userId: user.id } };

    await confirmationEmailConsumer.process(job as Job);

    const validTokens = await tokensRepository.findValidTokensByUserIdAndType(
      user.id,
      TokenType.CONFIRMATION_EMAIL,
    );

    const token = validTokens[0];

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      recipients: [{ address: user.email, name: user.name }],
      subject: `Verifique seu e-mail da ${process.env.MAIL_FROM_NAME}`,
      template: 'confirmation-email',
      context: {
        name: user.name,
        confirmationLink: `${process.env.APP_URL}/confirm-email?token=${token.token}`,
        from: process.env.MAIL_FROM_NAME,
      },
    });
  });
});
