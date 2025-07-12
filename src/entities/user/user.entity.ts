import { Encryption } from '@/utils/encryption';

type UserProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export class User {
  constructor(private readonly props: UserProps) {}

  toJSON(): Omit<UserProps, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeProps } = this.props;
    return safeProps;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  set id(id: string) {
    this.props.id = id;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get confirmedAt(): Date | undefined {
    return this.props.confirmedAt;
  }

  set confirmedAt(date: Date | undefined) {
    this.props.confirmedAt = date;
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

  async checkPassword(password: string): Promise<boolean> {
    return Encryption.compare(password, this.props.password);
  }

  async changePassword(newPassword: string): Promise<void> {
    this.props.password = await Encryption.hash(newPassword);
  }
}
