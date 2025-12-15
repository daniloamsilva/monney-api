import { HttpStatus } from '@nestjs/common';

import { GetUserService } from '@src/application/users/services/get-user.service';
import { UserFactory } from '@tests/mocks/factories/user.factory';
import { InMemoryUsersRepository } from '@tests/mocks/repositories/users-repository';

describe('GetUserService', () => {
  let getUserService: GetUserService;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getUserService = new GetUserService(usersRepository);
  });

  it('should not be able to get a user information if user does not exist', async () => {
    await expect(getUserService.execute('non-existing-id')).rejects.toThrow(
      'User not found',
    );
  });

  it('should be able to get a user information', async () => {
    const user = UserFactory.create();
    await usersRepository.save(user);

    const result = await getUserService.execute(user.id);

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.message).toBe('User retrieved successfully');
    expect(result.data.id).toBe(user.id);
    expect((result.data as any).password).toBeUndefined();
    expect((result.data as any).tokens).toBeUndefined();
  });
});
