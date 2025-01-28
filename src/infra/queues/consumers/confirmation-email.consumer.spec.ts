import { MailerService } from '@/infra/mailer/mailer.service';
import { ConfirmationEmailConsumer } from './confirmation-email.consumer';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenFactory } from '@/entities/token/token.factory';
import { Job } from 'bullmq';

describe('ConfirmationEmailConsumer', () => {
  let confirmationEmailConsumer: ConfirmationEmailConsumer;
  let mailerService: MailerService;

  beforeEach(() => {
    mailerService = {
      sendMail: jest.fn(),
    } as unknown as MailerService;
    confirmationEmailConsumer = new ConfirmationEmailConsumer(mailerService);
  });

  it('should be able to send a confirmation email', async () => {
    const user = UserFactory.create();
    const token = TokenFactory.create({ userId: user.id });
    const job = { data: { user, token } };

    await confirmationEmailConsumer.process(job as Job);

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
