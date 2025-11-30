import { Job } from 'bullmq';

import { MailerService } from '@src/infrastructure/mailer/mailer.service';
import { EmailConfirmationConsumer } from '@src/infrastructure/queues/consumers/email-confirmation.consumer';
import { UserFactory } from '@tests/mocks/factories/user.factory';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { InMemoryUsersRepository } from '@tests/mocks/repositories/users-repository';

describe('EmailConfirmationConsumer', () => {
  let emailConfirmationConsumer: EmailConfirmationConsumer;
  let mailerService: MailerService;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    mailerService = {
      sendMail: jest.fn(),
    } as unknown as MailerService;

    emailConfirmationConsumer = new EmailConfirmationConsumer(
      mailerService,
      usersRepository,
    );
  });

  it('should be able to send a confirmation email', async () => {
    const user = UserFactory.create();
    await usersRepository.save(user);
    const job = { data: { userId: user.id } };

    await emailConfirmationConsumer.process(job as Job);

    const token = user.tokens.find((t) => t.type === 'EMAIL_CONFIRMATION');

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      recipients: [{ address: user.email.value, name: user.name }],
      subject: `Verifique seu e-mail da ${process.env.MAIL_FROM_NAME}`,
      template: 'email-confirmation',
      context: {
        name: user.name,
        confirmationLink: `${process.env.APP_URL}/confirm-email?token=${token.value}`,
        from: process.env.MAIL_FROM_NAME,
      },
    });
  });
});
