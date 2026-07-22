type WalletProps = {
  id?: string;
  userId: string;
  name: string;
  initialBalance: number;
  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export class Wallet {
  constructor(private readonly props: WalletProps) {}

  get id(): string | undefined {
    return this.props.id;
  }

  set id(id: string | undefined) {
    this.props.id = id;
  }

  get userId(): string {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get initialBalance(): number {
    return this.props.initialBalance;
  }

  set initialBalance(balance: number) {
    this.props.initialBalance = balance;
  }

  get isDefault(): boolean {
    return this.props.isDefault;
  }

  set isDefault(isDefault: boolean) {
    this.props.isDefault = isDefault;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  set deletedAt(deletedAt: Date | undefined) {
    this.props.deletedAt = deletedAt;
  }
}
