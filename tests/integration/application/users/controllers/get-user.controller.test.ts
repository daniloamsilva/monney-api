import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { User } from '@src/domain/users/entities/user.entity';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { TestSetup } from '@tests/integration/test.setup';
import { UserFactory } from '@tests/mocks/factories/user.factory';
import { Password } from '@src/domain/users/value-objects/password.vo';

describe('GetUserController', () => {
  let app: INestApplication;
  let usersRepository: IUsersRepository;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestSetup.setup());

    const password = 'pass1234';
    user = UserFactory.create({ password: await Password.create(password) });
    await usersRepository.save(user);

    const response = await request(app.getHttpServer()).post('/login').send({
      email: user.email.value,
      password: password,
    });

    accessToken = response.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to get user details without authentication', async () => {
    const response = await request(app.getHttpServer()).get('/users/me');

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should be able to get logged user details', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
  });
});
