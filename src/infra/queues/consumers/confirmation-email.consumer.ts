import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { Queues } from '../queues.enum';
import { User } from '@/entities/user/user.entity';
import { Token } from '@/entities/token/token.entity';
import { MailerService } from '@/infra/mailer/mailer.service';

@Processor(Queues.CONFIRMATION_EMAIL)
export class ConfirmationEmailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<{ user: User; token: Token }>): Promise<void> {
    const { user, token } = job.data;
    const { name, email } = user;

    try {
      await this.mailerService.sendMail({
        recipients: [{ address: email, name }],
        subject: `Verifique seu e-mail da ${process.env.MAIL_FROM_NAME}`,
        template: 'confirmation-email',
        context: {
          name,
          confirmationLink: `${process.env.APP_URL}/confirm-email?token=${token.token}`,
          from: process.env.MAIL_FROM_NAME,
        },
      });
    } catch (error) {
      console.log('Error sending confirmation email:', error);
    }
  }
}
