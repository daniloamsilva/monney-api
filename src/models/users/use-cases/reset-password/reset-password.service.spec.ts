import { HttpStatus } from '@nestjs/common';

import { ResetPasswordService } from './reset-password.service';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { TokenFactory } from '@/entities/token/token.factory';
import { TokenType } from '@/entities/token/token.entity';

describe('ResetPasswordService', () => {
  let resetPasswordService: ResetPasswordService;
  let usersRepository: UsersRepositoryInterface;
  let tokensRepository: TokensRepositoryInterface;

  const newPassword = 'newPassword123';

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    tokensRepository = new TokensInMemoryRepository();
    resetPasswordService = new ResetPasswordService(
      usersRepository,
      tokensRepository,
    );
  });

  it('should not be able to reset password with invalid token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'invalid-token',
        newPassword,
        newPasswordConfirmation: newPassword,
      }),
    ).rejects.toThrow('Token not found');
  });

  it('should not be able to reset password with expired token', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        expiresAt: new Date('2021-01-01'),
      }),
    );

    await expect(
      resetPasswordService.execute({
        token: token.token,
        newPassword,
        newPasswordConfirmation: newPassword,
      }),
    ).rejects.toThrow('Token not found');
  });

  it('should not be able to reset password with used token', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        usedAt: new Date(),
      }),
    );

    await expect(
      resetPasswordService.execute({
        token: token.token,
        newPassword,
        newPasswordConfirmation: newPassword,
      }),
    ).rejects.toThrow('Token not found');
  });

  it('should not be able to reset password with wrong token type', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    await expect(
      resetPasswordService.execute({
        token: token.token,
        newPassword,
        newPasswordConfirmation: newPassword,
      }),
    ).rejects.toThrow('Token not found');
  });

  it('should be able to reset password with valid token', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
      }),
    );

    const result = await resetPasswordService.execute({
      token: token.token,
      newPassword,
      newPasswordConfirmation: newPassword,
    });

    const updatedUser = await usersRepository.findById(user.id);
    const updatedToken = await tokensRepository.findById(token.id);

    expect(await updatedUser.checkPassword(newPassword)).toBe(true);
    expect(updatedToken.usedAt).toBeDefined();
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.message).toBe('Password reset successfully');
  });
});
