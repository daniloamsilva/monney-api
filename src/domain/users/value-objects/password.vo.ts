import * as bcrypt from 'bcrypt';

import { ValueObject } from '@src/domain/shared/ValueObject';
import { DomainError } from '@src/domain/shared/DomainError';

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public async compare(plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, this.props.value);
  }

  private static validate(plainText: string): void {
    if (plainText.length < 8) {
      throw new DomainError(
        'Password must be longer than or equal to 8 characters',
      );
    }
  }

  public static async create(plainText: string): Promise<Password> {
    this.validate(plainText);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainText, salt);
    return new Password({ value: hash });
  }

  public static fromHash(hash: string): Password {
    return new Password({ value: hash });
  }
}
