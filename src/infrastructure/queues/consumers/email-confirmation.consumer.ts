import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QueueType } from '../queues.enum';
import { MailerService } from '@src/infrastructure/mailer/mailer.service';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { USERS_REPOSITORY_PROVIDER } from '@src/infrastructure/repositories/postgres/users.repository';

@Processor(QueueType.CONFIRMATION_EMAIL)
export class EmailConfirmationConsumer extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly usersRepository: IUsersRepository,
    // @Inject(Providers.TOKENS_REPOSITORY)
    // private readonly tokensRepository: TokensRepositoryInterface,
  ) {
    super();
  }

  async process(job: Job<{ userId: string }>): Promise<void> {
    const user = await this.usersRepository.findById(job.data.userId);
    // const token = await this.tokensRepository.save(
    //   new Token({
    //     userId: user.id,
    //     type: TokenType.CONFIRMATION_EMAIL,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   }),
    // );

    const token = {
      value: 'token-placeholder',
    };

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
    }
  }
}
