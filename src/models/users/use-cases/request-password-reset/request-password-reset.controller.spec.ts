import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { UserFactory } from '@/entities/user/user.factory';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TestHelper } from '@/utils/test.helper';

describe('RequestPasswordResetController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;

  beforeAll(async () => {
    ({ app, usersRepository } = await TestHelper.setup());
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to request password reset without email', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({});

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should not be able to request password reset with invalid email', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should be able to request password reset with valid email', async () => {
    const user = await usersRepository.save(UserFactory.create());

    const response = await request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({ email: user.email });

    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
