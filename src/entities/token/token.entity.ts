export class Token {
  id?: number;
  userId: string;
  token?: string;
  type: TokenType;
  usedAt?: Date;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(token: Token) {
    Object.assign(this, token);
  }
}

export enum TokenType {
  CONFIRMATION_EMAIL = 'CONFIRMATION_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
}
