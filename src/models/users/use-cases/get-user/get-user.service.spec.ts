import { HttpStatus } from '@nestjs/common';

import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { GetUserService } from './get-user.service';
import { UserFactory } from '@/entities/user/user.factory';

describe('GetuUserService', () => {
  let getUserService: GetUserService;
  let usersRepository: UsersInMemoryRepository;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    getUserService = new GetUserService(usersRepository);
  });

  it('should not be able to get an user information if user does not exist', async () => {
    await expect(getUserService.execute('non-existing-id')).rejects.toThrow(
      'User not found',
    );
  });

  it('should be able to get an user information', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const result = await getUserService.execute(user.id);

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.message).toBe('User retrieved successfully');
    expect(result.data.id).toBe(user.id);
  });
});
