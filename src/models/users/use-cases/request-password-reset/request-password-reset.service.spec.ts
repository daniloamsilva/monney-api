import { HttpStatus } from '@nestjs/common';
import { Queue } from 'bullmq';

import { RequestPasswordResetService } from './request-password-reset.service';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { QueuesService } from '@/infra/queues/queues.service';

describe('RequestPasswordResetService', () => {
  let requestPasswordResetService: RequestPasswordResetService;
  let usersRepository: UsersRepositoryInterface;
  let queuesService: QueuesService;
  let passwordResetEmailQueue: Queue;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();

    passwordResetEmailQueue = {
      add: jest.fn(),
    } as unknown as Queue;

    queuesService = new QueuesService({} as Queue, passwordResetEmailQueue);

    requestPasswordResetService = new RequestPasswordResetService(
      usersRepository,
      queuesService,
    );
  });

  it('should not able to request password reset if user does not exist', async () => {
    await expect(
      requestPasswordResetService.execute({
        email: 'non-exiting-user-email',
      }),
    ).rejects.toThrow('User not found');
  });

  it('should be able to request password reset', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const result = await requestPasswordResetService.execute({
      email: user.email,
    });

    expect(result).toEqual({
      statusCode: HttpStatus.CREATED,
      message: 'Password reset email sent successfully',
    });
    expect(passwordResetEmailQueue.add).toHaveBeenCalledTimes(1);
  });
});
