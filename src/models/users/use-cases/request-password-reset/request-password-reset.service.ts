import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { SendEmailService } from '@/models/tokens/use-cases/send-email/send-email.service';
import { TokenType } from '@/entities/token/token.entity';

@Injectable()
export class RequestPasswordResetService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.sendEmailService.execute({
      userId: user.id,
      tokenType: TokenType.PASSWORD_RESET,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password reset email sent successfully',
    };
  }
}
