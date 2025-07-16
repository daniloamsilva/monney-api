import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { User } from '@/entities/user/user.entity';
import { UserFactory } from '@/entities/user/user.factory';
import { TestHelper } from '@/utils/test.helper';

describe('UpdatePasswordController', () => {
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

  it('should not able to update password without authentication', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .send({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should not able to update password with an empty new password', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pass1234',
        newPassword: '',
        newPasswordConfirmation: '',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toContain(
      'newPassword must be longer than or equal to 8 characters',
    );
  });

  it('should not able to update password if current password is incorrect', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(response.body.message).toContain('Current password is incorrect');
  });

  it('should not able to update password if new password confirmation does not match', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pass1234',
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'differentPassword123',
      });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toContain(
      "newPassword and newPasswordConfirmation don't match",
    );
  });

  it('should be able to update user password', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pass1234',
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.OK);
  });
});
