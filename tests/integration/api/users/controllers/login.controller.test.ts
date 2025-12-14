import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { TestSetup } from '@tests/integration/test.setup';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { UserFactory } from '@tests/mocks/factories/user.factory';
import { User } from '@src/domain/users/entities/user.entity';
import { Password } from '@src/domain/users/value-objects/password.vo';

describe('LoginController', () => {
  let app: INestApplication;
  let usersRepository: IUsersRepository;
  let user: User;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestSetup.setup());

    user = UserFactory.create({ password: await Password.create('pass1234') });
    await usersRepository.save(user);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to login with an invalid email format', async () => {
    const response = await request(app.getHttpServer()).post('/login').send({
      email: 'invalid-format-email',
      password: 'password',
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('email must be an email');
  });

  it('should not be able to login with non-existing user', async () => {
    const response = await request(app.getHttpServer()).post('/login').send({
      email: 'non-existing@email.com',
      password: 'invalid_password',
    });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toEqual('Invalid email or password');
  });

  it('should not be able to login with invalid password', async () => {
    const response = await request(app.getHttpServer()).post('/login').send({
      email: user.email.value,
      password: 'invalid_password',
    });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toEqual('Invalid email or password');
  });

  it('should be able to login', async () => {
    const response = await request(app.getHttpServer()).post('/login').send({
      email: user.email.value,
      password: 'pass1234',
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toEqual('Login successful');
    expect(response.body.data.accessToken).toBeDefined();
  });
});
