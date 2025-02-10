import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UpdateNameService } from './update-name.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';

describe('UpdateNameService', () => {
  let updateNameService: UpdateNameService;
  let usersRepository: UsersRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    updateNameService = new UpdateNameService(usersRepository);
  });

  it('should be able to update user name', async () => {
    let user = await usersRepository.save(UserFactory.create());
    const result = await updateNameService.execute(user, {
      name: 'Updated Name',
    });
    user = await usersRepository.findById(user.id);

    expect(user.name).toBe('Updated Name');
    expect(result.statusCode).toBe(200);
    expect(result.message).toBe('User name updated successfully');
  });
});
