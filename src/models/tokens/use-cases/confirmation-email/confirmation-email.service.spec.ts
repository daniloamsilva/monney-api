import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { ConfirmationEmailService } from './confirmation-email.service';
import { TokensInMemoryRepository } from '@/repositories/tokens/tokens-in-memory.repository';
import { TokenFactory } from '@/entities/token/token.factory';
import { TokenType } from '@/entities/token/token.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';

describe('ConfirmationEmailService', () => {
  let confirmationEmailService: ConfirmationEmailService;
  let tokensRepository: TokensRepositoryInterface;
  let usersRepository: UsersRepositoryInterface;

  beforeEach(() => {
    tokensRepository = new TokensInMemoryRepository();
    usersRepository = new UsersInMemoryRepository();

    confirmationEmailService = new ConfirmationEmailService(
      tokensRepository,
      usersRepository,
    );
  });

  it('should not be able to use a non existing token', async () => {
    await expect(
      confirmationEmailService.execute('not-found-token'),
    ).rejects.toThrow('Token not found');
  });

  it('should not be able to use a token with a different type', async () => {
    const token = await tokensRepository.save(
      TokenFactory.create({ type: TokenType.PASSWORD_RESET }),
    );

    await expect(confirmationEmailService.execute(token.token)).rejects.toThrow(
      'Token not found',
    );
  });

  it('should not be able to use an expired token', async () => {
    const token = await tokensRepository.save(
      TokenFactory.create({
        expiresAt: new Date('2021-01-01'),
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    await expect(confirmationEmailService.execute(token.token)).rejects.toThrow(
      'Token not found',
    );
  });

  it('should not be able to use a used token', async () => {
    const token = await tokensRepository.save(
      TokenFactory.create({
        usedAt: new Date(),
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    await expect(confirmationEmailService.execute(token.token)).rejects.toThrow(
      'Token not found',
    );
  });

  it('should be able to confirm the email', async () => {
    const user = await usersRepository.save(UserFactory.create());
    const token = await tokensRepository.save(
      TokenFactory.create({
        userId: user.id,
        type: TokenType.CONFIRMATION_EMAIL,
      }),
    );

    const result = await confirmationEmailService.execute(token.token);
    const updatedToken = await tokensRepository.findByToken(token.token);
    const updatedUser = await usersRepository.findById(user.id);

    expect(updatedToken.usedAt).not.toBeNull();
    expect(updatedUser.confirmedAt).not.toBeNull();

    expect(result).toMatchObject({
      statusCode: 200,
      message: 'Email confirmed successfully',
    });
  });
});
