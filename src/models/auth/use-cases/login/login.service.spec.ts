import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { LoginService } from './login.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';

describe('LoginService', () => {
  let loginService: LoginService;
  let usersRepository: UsersRepositoryInterface;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    loginService = new LoginService(usersRepository);
  });

  it('should not be able to login with non-existing user', async () => {
    await expect(
      loginService.execute({
        email: 'non-existing-email',
        password: 'invalid_password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should not be able to login with invalid password', async () => {
    const userPassword = 'pass1234';
    const user = await usersRepository.save(
      UserFactory.create({ password: userPassword }),
    );

    await expect(
      loginService.execute({
        email: user.email,
        password: 'invalid_password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should be able to login', async () => {
    const userPassword = 'pass1234';
    const user = await usersRepository.save(
      UserFactory.create({ password: userPassword }),
    );

    const result = await loginService.execute({
      email: user.email,
      password: userPassword,
    });

    expect(result).toMatchObject({
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        accessToken: {
          sub: user.id,
          email: user.email,
          exp: expect.any(Number),
          iat: expect.any(Number),
        },
      },
    });
  });
});
