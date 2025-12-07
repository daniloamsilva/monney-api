import { addMinutes } from 'date-fns';
import { v7 as uuid } from 'uuid';

import { Aggregate } from '@src/domain/shared/Aggregate';

interface TokenProps {
  id: string;
  type: TokenType;
  expiresAt: Date;
  usedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum TokenType {
  EMAIL_CONFIRMATION = 'EMAIL_CONFIRMATION',
}

const TOKEN_EXPIRATION_IN_MINUTES: Record<TokenType, number> = {
  [TokenType.EMAIL_CONFIRMATION]: 7 * 24 * 60, // 7 days
};

export class Token extends Aggregate<TokenProps> {
  private constructor(props: TokenProps) {
    super(props);
  }

  get value(): string {
    return this.props.id;
  }
  get type(): TokenType {
    return this.props.type;
  }
  get expiresAt(): Date {
    return this.props.expiresAt;
  }
  get usedAt(): Date | undefined {
    return this.props.usedAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  public static create(type: TokenType): Token {
    const expirationInMinutes = TOKEN_EXPIRATION_IN_MINUTES[type];

    const tokenProps: TokenProps = {
      id: uuid(),
      type: type,
      expiresAt: addMinutes(new Date(), expirationInMinutes),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Token(tokenProps);
  }

  public static hydrate(props: TokenProps): Token {
    return new Token(props);
  }

  get isUsed(): boolean {
    return !!this.usedAt;
  }

  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  get isValid(): boolean {
    return !this.isUsed && !this.isExpired && !this.deletedAt;
  }

  public invalidate(): void {
    if (this.isValid) {
      this.props.deletedAt = new Date();
    }
  }
}
