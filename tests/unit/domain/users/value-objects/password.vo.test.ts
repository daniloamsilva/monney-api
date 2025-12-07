import { Password } from '@src/domain/users/value-objects/password.vo';
import { DomainError } from '@src/domain/shared/DomainError';

describe('PasswordValueObject', () => {
  describe('create', () => {
    it('should create a valid password', async () => {
      const plainText = 'password123';
      const password = await Password.create(plainText);

      expect(password).toEqual(
        expect.objectContaining({
          props: { value: expect.any(String) },
        }),
      );
      expect(password.value).not.toBe('password123');
      expect(password.value).not.toBe(plainText);
      expect(password.value.length).toBeGreaterThan(0);
      expect(password.value).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('should create different hashes for same password', async () => {
      const password1 = await Password.create('password123');
      const password2 = await Password.create('password123');

      expect(password1.value).not.toBe(password2.value);
    });

    it('should throw error for password shorter than 8 characters', async () => {
      await expect(Password.create('short')).rejects.toThrow(DomainError);
      await expect(Password.create('short')).rejects.toThrow(
        'Password must be longer than or equal to 8 characters',
      );
    });

    it('should throw error for empty password', async () => {
      await expect(Password.create('')).rejects.toThrow(DomainError);
      await expect(Password.create('')).rejects.toThrow(
        'Password must be longer than or equal to 8 characters',
      );
    });

    it('should throw error for password with 7 characters', async () => {
      await expect(Password.create('1234567')).rejects.toThrow(DomainError);
      await expect(Password.create('1234567')).rejects.toThrow(
        'Password must be longer than or equal to 8 characters',
      );
    });

    it('should accept password with exactly 8 characters', async () => {
      const password = await Password.create('12345678');

      expect(password.value).toBeDefined();
      expect(password.value).not.toBe('12345678');
    });

    it('should accept password with more than 8 characters', async () => {
      const password = await Password.create('verylongpassword123');

      expect(password.value).toBeDefined();
      expect(password.value).not.toBe('verylongpassword123');
    });

    it('should accept password with special characters', async () => {
      const password = await Password.create('p@ssw0rd!#$');

      expect(password.value).toBeDefined();
    });

    it('should accept password with spaces', async () => {
      const password = await Password.create('pass word 123');

      expect(password.value).toBeDefined();
    });
  });

  describe('fromHash', () => {
    it('should create password from hash', () => {
      const hash = '$2b$10$hashedpassword123456789012345678901234567890123456';
      const password = Password.fromHash(hash);

      expect(password).toEqual(
        expect.objectContaining({
          props: { value: hash },
        }),
      );
      expect(password.value).toBe(hash);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const plainText = 'password123';
      const password = await Password.create(plainText);

      const result = await password.compare(plainText);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = await Password.create('password123');

      const result = await password.compare('wrongpassword');

      expect(result).toBe(false);
    });

    it('should return false for empty string', async () => {
      const password = await Password.create('password123');

      const result = await password.compare('');

      expect(result).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = await Password.create('Password123');

      const result = await password.compare('password123');

      expect(result).toBe(false);
    });

    it('should handle special characters correctly', async () => {
      const plainText = 'p@ssw0rd!#$';
      const password = await Password.create(plainText);

      const result = await password.compare(plainText);

      expect(result).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for same hash', () => {
      const hash = '$2b$10$hashedpassword123456789012345678901234567890123456';
      const password1 = Password.fromHash(hash);
      const password2 = Password.fromHash(hash);

      expect(password1.equals(password2)).toBe(true);
    });

    it('should return false for different hashes', () => {
      const hash1 = '$2b$10$hash1234567890123456789012345678901234567890123456';
      const hash2 = '$2b$10$hash2234567890123456789012345678901234567890123456';

      const password1 = Password.fromHash(hash1);
      const password2 = Password.fromHash(hash2);

      expect(password1.equals(password2)).toBe(false);
    });

    it('should return false for same plaintext with different hashes', async () => {
      const password1 = await Password.create('password123');
      const password2 = await Password.create('password123');

      expect(password1.equals(password2)).toBe(false);
    });
  });
});
