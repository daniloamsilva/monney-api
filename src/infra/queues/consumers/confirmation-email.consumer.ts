import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { Queues } from '../queues.enum';
import { User } from '@/entities/user/user.entity';
import { MailerService } from '@/infra/mailer/mailer.service';

@Processor(Queues.CONFIRMATION_EMAIL)
export class ConfirmationEmailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<User>): Promise<void> {
    const { name, email } = job.data;

    try {
      await this.mailerService.sendMail({
        recipients: [{ address: email, name }],
        subject: `Verifique seu e-mail da ${process.env.MAIL_FROM_NAME}`,
        template: 'confirmation-email',
        context: {
          name,
          confirmationLink: `${process.env.APP_URL}/confirm-email?token=`,
          from: process.env.MAIL_FROM_NAME,
        },
      });
    } catch (error) {
      console.log('Error sending confirmation email:', error);
    }
  }
}
