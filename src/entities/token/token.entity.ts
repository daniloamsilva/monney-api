type TokenProps = {
  id?: number;
  userId: string;
  token?: string;
  type: TokenType;
  usedAt?: Date;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export class Token {
  constructor(private readonly props: TokenProps) {}

  set id(id: number | undefined) {
    this.props.id = id;
  }

  set token(token: string | undefined) {
    this.props.token = token;
  }

  set usedAt(date: Date | undefined) {
    this.props.usedAt = date;
  }

  set expiresAt(date: Date | undefined) {
    this.props.expiresAt = date;
  }

  set deletedAt(date: Date | undefined) {
    this.props.deletedAt = date;
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): TokenType {
    return this.props.type;
  }

  get token(): string | undefined {
    return this.props.token;
  }

  get usedAt(): Date | undefined {
    return this.props.usedAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

export enum TokenType {
  CONFIRMATION_EMAIL = 'CONFIRMATION_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
}
