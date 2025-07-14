import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QueueType } from '../queues.enum';
import { MailerService } from '@/infra/mailer/mailer.service';
import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { Token, TokenType } from '@/entities/token/token.entity';

@Processor(QueueType.CONFIRMATION_EMAIL)
export class ConfirmationEmailConsumer extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
  ) {
    super();
  }

  async process(job: Job<{ userId: string }>): Promise<void> {
    const user = await this.usersRepository.findById(job.data.userId);
    const token = await this.tokensRepository.save(
      new Token({
        userId: user.id,
        type: TokenType.CONFIRMATION_EMAIL,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    try {
      await this.mailerService.sendMail({
        recipients: [{ address: user.email, name: user.name }],
        subject: `Verifique seu e-mail da ${process.env.MAIL_FROM_NAME}`,
        template: 'confirmation-email',
        context: {
          name: user.name,
          confirmationLink: `${process.env.APP_URL}/confirm-email?token=${token.token}`,
          from: process.env.MAIL_FROM_NAME,
        },
      });
    } catch (error) {
      Logger.error(
        'Error sending confirmation email:',
        error,
        ConfirmationEmailConsumer.name,
      );
    }
  }
}
