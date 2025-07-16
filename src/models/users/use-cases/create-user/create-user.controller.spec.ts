import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UserFactory } from '@/entities/user/user.factory';
import { TestHelper } from '@/utils/test.helper';

describe('CreateUserController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestHelper.setup());
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to create a new user with an invalid email', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual(['email must be an email']);
  });

  it('should not be able to create a new user with a password less than 8 characters', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'pass',
      passwordConfirmation: 'pass',
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual([
      'password must be longer than or equal to 8 characters',
    ]);
  });

  it('should not be able to create a new user with a passwordConfirmation different from password', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'pass1234',
      passwordConfirmation: 'different-pass',
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual([
      "password and passwordConfirmation don't match",
    ]);
  });

  it('should not be able to create a new user with the an email already used', async () => {
    const user = await usersRepository.save(UserFactory.create());

    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: user.email,
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    expect(response.status).toBe(HttpStatus.CONFLICT);
  });

  it('should be able to create a new user successfully', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
