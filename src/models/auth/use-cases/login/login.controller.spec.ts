import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UserFactory } from '@/entities/user/user.factory';
import { TestHelper } from '@/utils/test.helper';

describe('LoginController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestHelper.setup());
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to login with a invalid email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid-format-email',
        password: 'password',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual(['email must be an email']);
  });

  it('should not be able to login with non-existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'non-existing@email.com',
        password: 'invalid_password',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toEqual('Invalid email or password');
  });

  it('should not be able to login with invalid password', async () => {
    const userPassword = 'pass1234';
    const user = await usersRepository.save(
      UserFactory.create({ password: userPassword }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'invalid_password',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toEqual('Invalid email or password');
  });

  it('should be able to login', async () => {
    const userPassword = 'pass1234';
    const user = await usersRepository.save(
      UserFactory.create({ password: userPassword }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: userPassword,
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toEqual('User logged in successfully');
    expect(response.body.data.accessToken).toBeDefined();
  });
});
