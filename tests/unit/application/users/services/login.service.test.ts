import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginService } from '@src/application/users/services/login.service';
import { User } from '@src/domain/users/entities/user.entity';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { Password } from '@src/domain/users/value-objects/password.vo';
import { UserFactory } from '@tests/mocks/factories/user.factory';
import { InMemoryUsersRepository } from '@tests/mocks/repositories/users-repository';

describe('LoginService', () => {
  let loginService: LoginService;
  let usersRepository: IUsersRepository;
  let jwtService: JwtService;
  let user: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    jwtService = new JwtService({ secret: 'secret' });
    loginService = new LoginService(usersRepository, jwtService);

    user = UserFactory.create({
      password: await Password.create('pass1234'),
    });
    await usersRepository.save(user);
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
    await expect(
      loginService.execute({
        email: user.email.value,
        password: 'invalid_password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should be able to login', async () => {
    const result = await loginService.execute({
      email: user.email.value,
      password: 'pass1234',
    });

    expect(result).toMatchObject({
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: {
        accessToken: expect.any(String),
      },
    });
  });
});
