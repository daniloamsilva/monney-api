import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { TokenType } from '@/entities/token/token.entity';
import { TokenFactory } from '@/entities/token/token.factory';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UserFactory } from '@/entities/user/user.factory';
import { TestHelper } from '@/utils/test.helper';

describe('ConfirmationEmailController', () => {
  let app: INestApplication;
  let tokensRepository: TokensRepositoryInterface;
  let usersRepository: UsersRepositoryInterface;

  beforeAll(async () => {
    ({ app, tokensRepository, usersRepository } = await TestHelper.setup());
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to use a non existing token', async () => {
    const response = await request(app.getHttpServer()).patch(
      '/users/confirmation-email/a6691860-5000-42cd-9819-8701219a92d1',
    );

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toEqual('Token not found');
  });

  it('should not be able to use a token with a different type', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({ userId: user.id, type: TokenType.PASSWORD_RESET }),
    );

    const response = await request(app.getHttpServer()).patch(
      `/users/confirmation-email/${token.token}`,
    );

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toEqual('Token not found');
  });

  it('should not be able to use an invalid uuid token format', async () => {
    const response = await request(app.getHttpServer()).patch(
      '/users/confirmation-email/invalid-uuid-format',
    );

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('Invalid token format');
  });

  it('should not be able to use an expired token', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const newToken = TokenFactory.create({
      userId: user.id,
      expiresAt: new Date('2021-01-01'),
      type: TokenType.CONFIRMATION_EMAIL,
    });
    const token = await tokensRepository.save(newToken);

    const response = await request(app.getHttpServer()).patch(
      `/users/confirmation-email/${token.token}`,
    );

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toEqual('Token not found');
  });

  it('should not be able to use a used token', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        usedAt: new Date(),
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    const response = await request(app.getHttpServer()).patch(
      `/users/confirmation-email/${token.token}`,
    );

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toEqual('Token not found');
  });

  it('should be able to confirm the email', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    const response = await request(app.getHttpServer()).patch(
      `/users/confirmation-email/${token.token}`,
    );

    const updatedToken = await tokensRepository.findByToken(token.token);
    const updatedUser = await usersRepository.findById(user.id);

    expect(updatedToken.usedAt).not.toBeNull();
    expect(updatedUser.confirmedAt).not.toBeUndefined();
    expect(updatedUser.confirmedAt).not.toBeNull();
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toEqual('Email confirmed successfully');
  });
});
