import { fakerPT_BR as faker } from '@faker-js/faker';

import { Token } from '@src/domain/users/entities/token.entity';
import { User } from '@src/domain/users/entities/user.entity';
import { Email } from '@src/domain/users/value-objects/email.vo';
import { Password } from '@src/domain/users/value-objects/password.vo';

interface UserFactoryProps {
  id: string;
  name: string;
  email: Email;
  password: Password;
  confirmedAt?: Date | null;
  isActive: boolean;
  tokens?: Token[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class UserFactory {
  static create(override?: Partial<UserFactoryProps>): User {
    const name = override?.name ?? faker.person.fullName();

    const normalizedName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/gi, '');

    const email =
      override?.email ??
      Email.create(`${normalizedName}@${faker.internet.domainName()}`);

    const password =
      override?.password ?? Password.fromHash(faker.string.alphanumeric(60));

    const confirmedAt = override?.confirmedAt ?? null;
    const tokens = override?.tokens ?? [];
    const createdAt = override?.createdAt ?? faker.date.past();
    const updatedAt = override?.updatedAt ?? createdAt;
    const deletedAt = override?.deletedAt ?? null;

    return User.hydrate(
      Object.assign(
        {
          id: faker.string.uuid(),
          name,
          email,
          password,
          confirmedAt,
          isActive: true,
          tokens,
          createdAt,
          updatedAt,
          deletedAt,
        },
        override,
      ),
    );
  }
}
