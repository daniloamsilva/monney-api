import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { CreateUserService } from './create-user.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let usersRepository: UsersRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    createUserService = new CreateUserService(usersRepository);
  });

  it('should not be able to create a new user with the an email already used', async () => {
    const user = await usersRepository.save(UserFactory.create());

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: user.email,
        password: 'pass1234',
        passwordConfirmation: 'pass1234',
      }),
    ).rejects.toThrow('User already exists');
  });

  it('should be able to create a new user successfully', async () => {
    const result = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    const newUser = await usersRepository.findByEmail('johndoe@email.com');

    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('John Doe');
    expect(newUser.email).toBe('johndoe@email.com');
    expect(newUser.password).not.toBe('pass1234');
    expect(newUser.createdAt).not.toBeNull();
    expect(newUser.updatedAt).not.toBeNull();
    expect(newUser.deletedAt).toBeNull();

    expect(result).toMatchObject({
      statusCode: 201,
      message: 'User created successfully',
    });
  });
});
