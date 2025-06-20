import { HttpStatus } from '@nestjs/common';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UpdatePasswordService } from './update-password.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';

describe('UpdatePasswordService', () => {
  let updatePasswordService: UpdatePasswordService;
  let usersRepository: UsersRepositoryInterface;

  const currentPassword = 'currentPassword123';
  const newPassword = 'newPassword123';
  const wrongPassword = 'wrongPassword123';

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    updatePasswordService = new UpdatePasswordService(usersRepository);
  });

  it('should not able to update password if user does not exist', async () => {
    await expect(
      updatePasswordService.execute('non-existing-id', {
        currentPassword,
        newPassword,
      }),
    ).rejects.toThrow('User not found');
  });

  it('should not able to update password if current password is incorrect', async () => {
    const user = await usersRepository.save(
      UserFactory.create({
        password: currentPassword,
      }),
    );

    await expect(
      updatePasswordService.execute(user.id, {
        currentPassword: wrongPassword,
        newPassword,
      }),
    ).rejects.toThrow('Current password is incorrect');
  });

  it('should be able to update user password', async () => {
    const user = await usersRepository.save(
      UserFactory.create({
        password: currentPassword,
      }),
    );

    const result = await updatePasswordService.execute(user.id, {
      currentPassword,
      newPassword,
    });

    expect(await user.checkPassword(newPassword)).toBe(true);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.message).toBe('User password updated successfully');
  });
});
