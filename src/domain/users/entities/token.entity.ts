import { addMinutes } from 'date-fns';

import { Aggregate } from '@src/shared/domain/Aggregate';

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
  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  public static create(type: TokenType): Token {
    const experionInMinutes = TOKEN_EXPIRATION_IN_MINUTES[type];

    const tokenProps: TokenProps = {
      id: crypto.randomUUID(),
      type: type,
      expiresAt: addMinutes(new Date(), experionInMinutes),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Token(tokenProps);
  }

  public static hydrate(props: TokenProps): Token {
    return new Token(props);
  }
}
