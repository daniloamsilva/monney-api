import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UserFactory } from '@/entities/user/user.factory';
import { TestHelper } from '@/utils/test.helper';

describe('GetUserController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestHelper.setup());

    user = await usersRepository.save(
      UserFactory.create({ password: 'pass1234' }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'pass1234',
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
