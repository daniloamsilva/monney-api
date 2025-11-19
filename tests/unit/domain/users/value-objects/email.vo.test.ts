import { Email } from '@src/domain/users/value-objects/email.vo';
import { DomainError } from '@src/shared/domain/DomainError';

describe('EmailValueObject', () => {
  it('should create a valid email', () => {
    const email = Email.create('test@example.com');

    expect(email).toEqual(
      expect.objectContaining({
        props: { value: 'test@example.com' },
      }),
    );
  });

  it('should normalize email to lowercase', () => {
    const email = Email.create('TEST@EXAMPLE.COM');

    expect(email.value).toBe('test@example.com');
  });

  it('should trim whitespace from email', () => {
    const email = Email.create('  test@example.com  ');

    expect(email.value).toBe('test@example.com');
  });

  it('should normalize and trim email together', () => {
    const email = Email.create('  TEST@EXAMPLE.COM  ');

    expect(email.value).toBe('test@example.com');
  });

  it('should throw error for invalid email without @', () => {
    expect(() => Email.create('invalid-email')).toThrow(DomainError);
    expect(() => Email.create('invalid-email')).toThrow('Invalid email format');
  });

  it('should throw error for invalid email without domain', () => {
    expect(() => Email.create('invalid@')).toThrow(DomainError);
    expect(() => Email.create('invalid@')).toThrow('Invalid email format');
  });

  it('should throw error for invalid email without local part', () => {
    expect(() => Email.create('@example.com')).toThrow(DomainError);
    expect(() => Email.create('@example.com')).toThrow('Invalid email format');
  });

  it('should throw error for invalid email without TLD', () => {
    expect(() => Email.create('test@example')).toThrow(DomainError);
    expect(() => Email.create('test@example')).toThrow('Invalid email format');
  });

  it('should throw error for email with spaces', () => {
    expect(() => Email.create('test user@example.com')).toThrow(DomainError);
    expect(() => Email.create('test user@example.com')).toThrow(
      'Invalid email format',
    );
  });

  it('should throw error for empty email', () => {
    expect(() => Email.create('')).toThrow(DomainError);
    expect(() => Email.create('')).toThrow('Invalid email format');
  });

  it('should accept email with subdomain', () => {
    const email = Email.create('test@mail.example.com');

    expect(email.value).toBe('test@mail.example.com');
  });

  it('should accept email with plus sign', () => {
    const email = Email.create('test+tag@example.com');

    expect(email.value).toBe('test+tag@example.com');
  });

  it('should accept email with dots in local part', () => {
    const email = Email.create('first.last@example.com');

    expect(email.value).toBe('first.last@example.com');
  });

  it('should accept email with numbers', () => {
    const email = Email.create('user123@example456.com');

    expect(email.value).toBe('user123@example456.com');
  });

  it('should return true for equal emails', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('test@example.com');

    expect(email1.equals(email2)).toBe(true);
  });

  it('should return true for equal emails with different cases', () => {
    const email1 = Email.create('TEST@EXAMPLE.COM');
    const email2 = Email.create('test@example.com');

    expect(email1.equals(email2)).toBe(true);
  });

  it('should return false for different emails', () => {
    const email1 = Email.create('test1@example.com');
    const email2 = Email.create('test2@example.com');

    expect(email1.equals(email2)).toBe(false);
  });
});
