import { Token, TokenType } from '@src/domain/users/entities/token.entity';

describe('TokenEntity', () => {
  it('should create a new token with valid data', () => {
    const token = Token.create(TokenType.EMAIL_CONFIRMATION);

    expect(token).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          id: expect.any(String),
          type: TokenType.EMAIL_CONFIRMATION,
          expiresAt: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      }),
    );
    expect(token.deletedAt).toBeUndefined();
  });

  it('should generate unique IDs for different tokens', () => {
    const token1 = Token.create(TokenType.EMAIL_CONFIRMATION);
    const token2 = Token.create(TokenType.EMAIL_CONFIRMATION);

    expect(token1.id).not.toBe(token2.id);
  });

  it('should hydrate a token from given properties', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2024-12-31T23:59:59Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          id: 'token-id',
          type: TokenType.EMAIL_CONFIRMATION,
          expiresAt: new Date('2024-12-31T23:59:59Z'),
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        }),
      }),
    );
  });
});
