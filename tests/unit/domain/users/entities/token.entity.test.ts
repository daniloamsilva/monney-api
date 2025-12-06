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

  it('should return true if token has been used', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2024-12-31T23:59:59Z'),
      usedAt: new Date(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isUsed).toBe(true);
  });

  it('should return false if token has not been used', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2024-12-31T23:59:59Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isUsed).toBe(false);
  });

  it('should return true if token has expired', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2022-12-31T23:59:59Z'),
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isExpired).toBe(true);
  });

  it('should return false if token has not expired', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2999-12-31T23:59:59Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isExpired).toBe(false);
  });

  it('should return true if token is not used, not expired and not deleted', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2999-12-31T23:59:59Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isValid).toBe(true);
  });

  it('should return false if token is used', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2999-12-31T23:59:59Z'),
      usedAt: new Date(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isValid).toBe(false);
  });

  it('should return false if token is expired', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2022-12-31T23:59:59Z'),
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isValid).toBe(false);
  });

  it('should return false if token is deleted', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2999-12-31T23:59:59Z'),
      deletedAt: new Date(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);

    expect(token.isValid).toBe(false);
  });

  it('should set deletedAt when token is valid', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2999-12-31T23:59:59Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);
    token.invalidate();

    expect(token.deletedAt).toBeInstanceOf(Date);
  });

  it('should not set deletedAt when token is already invalid', () => {
    const props = {
      id: 'token-id',
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt: new Date('2022-12-31T23:59:59Z'),
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    const token = Token.hydrate(props);
    token.invalidate();

    expect(token.deletedAt).toBeUndefined();
  });
});
