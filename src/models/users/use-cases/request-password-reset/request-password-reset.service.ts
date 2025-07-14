import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { QueuesService } from '@/infra/queues/queues.service';
import { QueueType } from '@/infra/queues/queues.enum';
import { RequestPasswordResetRequestDto } from './request-password-reset.request.dto';

@Injectable()
export class RequestPasswordResetService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly queuesService: QueuesService,
  ) {}

  async execute({ email }: RequestPasswordResetRequestDto) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.queuesService.execute({
      userId: user.id,
      queueType: QueueType.PASSWORD_RESET_EMAIL,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password reset email sent successfully',
    };
  }
}
