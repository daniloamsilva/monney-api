import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { QueueType } from '../queues.enum';
import { MailerService } from '@/infra/mailer/mailer.service';
import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { Token, TokenType } from '@/entities/token/token.entity';

@Processor(QueueType.PASSWORD_RESET_EMAIL)
export class RequestPasswordResetConsumer extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
  ) {
    super();
  }

  async process(job: Job<{ userId: string }>) {
    const user = await this.usersRepository.findById(job.data.userId);
    const token = await this.tokensRepository.save(
      new Token({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    try {
      await this.mailerService.sendMail({
        recipients: [{ address: user.email, name: user.name }],
        subject: `Redefinição de senha da ${process.env.MAIL_FROM_NAME}`,
        template: 'password-reset',
        context: {
          name: user.name,
          email: user.email,
          resetLink: `${process.env.APP_URL}/reset-password?token=${token.token}`,
          from: process.env.MAIL_FROM_NAME,
        },
      });
    } catch (error) {
      Logger.error(
        'Error sending password reset email:',
        error,
        RequestPasswordResetConsumer.name,
      );
    }
  }
}
