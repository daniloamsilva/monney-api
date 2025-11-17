import { CreateUserService } from '@src/application/users/use-cases/create-user.service';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { Password } from '@src/domain/users/value-objects/password.vo';
import { UserFactory } from '@tests/factories/user.factory';
import { InMemoryUsersRepository } from '@tests/mocks/repositories/users-repository';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserService = new CreateUserService(usersRepository);
  });

  it('should not be able to create a new user with an email already used', async () => {
    const user = UserFactory.create();
    await usersRepository.save(user);

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: user.email,
        password: 'pass1234',
        passwordConfirmation: 'pass1234',
      }),
    ).rejects.toThrow('User email already exists');
  });

  it('should be able to create a new user successfully', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
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
