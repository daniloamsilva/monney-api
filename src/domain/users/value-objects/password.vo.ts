import * as bcrypt from 'bcrypt';

import { ValueObject } from '@src/shared/domain/ValueObject';

interface PasswordProps {
  value: string;
  isHashed: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public async compare(plainText: string): Promise<boolean> {
    if (!this.props.isHashed) {
      return this.props.value === plainText;
    }
    return bcrypt.compare(plainText, this.props.value);
  }

  public static async create(plainText: string): Promise<Password> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainText, salt);
    return new Password({ value: hash, isHashed: true });
  }

  public static fromHash(hash: string): Password {
    return new Password({ value: hash, isHashed: true });
  }
}
