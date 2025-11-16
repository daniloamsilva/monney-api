import { v7 as uuid } from 'uuid';

import { AggregateRoot } from '@src/shared/domain/AggregateRoot';
import { Password } from '../value-objects/password.vo';
import { UserCreatedEvent } from '../events/user-created.event';

interface UserCreateProps {
  email: string;
  name: string;
  plainTextPassword: string;
}

interface UserProps {
  id: string;
  email: string;
  name: string;
  password: Password;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  get email(): string {
    return this.props.email;
  }
  get name(): string {
    return this.props.name;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public static async create(props: UserCreateProps): Promise<User> {
    const id = uuid();
    const password = await Password.create(props.plainTextPassword);

    const userProps: UserProps = {
      id: id,
      email: props.email,
      name: props.name,
      password: password,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = new User(userProps);

    user.addDomainEvent(
      new UserCreatedEvent({
        aggregateId: id,
        email: props.email,
        name: props.name,
      }),
    );

    return user;
  }

  public static hydrate(props: UserProps): User {
    return new User(props);
  }
}
