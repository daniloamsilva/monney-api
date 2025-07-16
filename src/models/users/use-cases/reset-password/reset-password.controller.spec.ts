import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenFactory } from '@/entities/token/token.factory';
import { TokenType } from '@/entities/token/token.entity';
import { TestHelper } from '@/utils/test.helper';

describe('ResetPasswordController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;
  let tokensRepository: TokensRepositoryInterface;

  beforeAll(async () => {
    ({ app, usersRepository, tokensRepository } = await TestHelper.setup());
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to reset password without required fields', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/reset-password')
      .send({});

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should not be able to reset password with invalid token format', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/reset-password')
      .send({
        token: 'invalid-token',
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toContain('token must be a UUID');
  });

  it('should not be able to reset password with non-existing token', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/reset-password')
      .send({
        token: '550e8400-e29b-41d4-a716-446655440000',
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe('Token not found');
  });

  it('should not be able to reset password with password confirmation mismatch', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/users/reset-password')
      .send({
        token: token.token,
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'differentPassword123',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toContain(
      "newPassword and newPasswordConfirmation don't match",
    );
  });

  it('should be able to reset password with valid token', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/users/reset-password')
      .send({
        token: token.token,
        newPassword: 'newPassword123',
        newPasswordConfirmation: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
    });
  });
});
