import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

import { TestSetup } from '@tests/integration/test.setup';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { UserFactory } from '@tests/factories/user.factory';

describe('CreateUserController', () => {
  let app: INestApplication;
  let usersRepository: IUsersRepository;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestSetup.setup());
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

  it('should not be able to create a new user with an email already used', async () => {
    const user = UserFactory.create();
    await usersRepository.save(user);

    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: user.email,
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toBe('User email already exists');
  });

  it('should be able to create a new user successfully', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.message).toBe('User created successfully');
  });
});
