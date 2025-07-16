import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { User } from '@/entities/user/user.entity';
import { UserFactory } from '@/entities/user/user.factory';
import { TestHelper } from '@/utils/test.helper';

describe('UpdateNameController', () => {
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

  it('should not be able to update user name without authentication', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/name')
      .send({
        name: 'Updated Name',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should not able to update user name with an empty name', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/name')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should be able to update user name', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/name')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Name',
      });

    const updatedUser = await usersRepository.findById(user.id);

    expect(response.status).toBe(HttpStatus.OK);
    expect(updatedUser.name).toBe('Updated Name');
  });
});
