import { ValueObject } from '@src/shared/domain/ValueObject';
import { DomainError } from '@src/shared/domain/DomainError';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static create(email: string): Email {
    const normalizedEmail = email.toLowerCase().trim();

    if (!this.isValid(normalizedEmail)) {
      throw new DomainError('Invalid email format');
    }

    return new Email({ value: normalizedEmail });
  }
}
