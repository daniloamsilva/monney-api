import { CreateUserService } from '@src/users/application/use-cases/create-user.service';
import { IUserRepository } from '@src/users/domain/repositories/user-repository.interface';
import { Password } from '@src/users/domain/value-objects/Password';
import { UserFactory } from '@tests/factories/user.factory';
import { InMemoryUserRepository } from '@tests/mocks/repositories/user-repository';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let usersRepository: IUserRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    createUserService = new CreateUserService(usersRepository);
  });

  it('should not be able to create a new user with the an email already used', async () => {
    const user = UserFactory.create();
    await usersRepository.save(user);

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: user.email,
        password: 'pass1234',
      }),
    ).rejects.toThrow('User email already exists');
  });

  it('should be able to create a new user successfully', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'pass1234',
    });

    const createdUser = await usersRepository.findByEmail(
      'john.doe@example.com',
    );

    expect(createdUser).toEqual(
      expect.objectContaining({
        props: {
          id: expect.any(String),
          email: 'john.doe@example.com',
          name: 'John Doe',
          isActive: true,
          password: expect.any(Password),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      }),
    );
  });
});
