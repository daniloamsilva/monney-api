import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QueueType } from '../queues.enum';
import { MailerService } from '@src/infrastructure/mailer/mailer.service';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { USERS_REPOSITORY_PROVIDER } from '@src/infrastructure/repositories/postgres/users.repository';
import { TokenType } from '@src/domain/users/entities/token.entity';

@Processor(QueueType.EMAIL_CONFIRMATION)
export class EmailConfirmationConsumer extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly usersRepository: IUsersRepository,
  ) {
    super();
  }

  async process(job: Job<{ userId: string }>): Promise<void> {
    const user = await this.usersRepository.findById(job.data.userId);

    if (!user) {
      throw Error(`User with ID ${job.data.userId} not found`);
    }

    const token = user.createToken(TokenType.EMAIL_CONFIRMATION);
    await this.usersRepository.save(user);

    try {
      await this.mailerService.sendMail({
        recipients: [{ address: user.email.value, name: user.name }],
        subject: `Verifique seu e-mail da ${process.env.MAIL_FROM_NAME}`,
        template: 'email-confirmation',
        context: {
          name: user.name,
          confirmationLink: `${process.env.APP_URL}/confirm-email?token=${token.value}`,
          from: process.env.MAIL_FROM_NAME,
        },
      });
    } catch (error) {
      Logger.error(
        'Error sending confirmation email:',
        error,
        EmailConfirmationConsumer.name,
      );
      throw error;
    }
  }
}
