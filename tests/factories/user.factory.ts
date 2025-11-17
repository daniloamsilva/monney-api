import { fakerPT_BR as faker } from '@faker-js/faker';

import { User } from '@src/domain/users/entities/user.entity';
import { Password } from '@src/domain/users/value-objects/password.vo';

interface UserFactoryProps {
  id: string;
  name: string;
  email: string;
  password: Password;
  confirmedAt?: Date | null;
  isActive: boolean;
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
      override?.email ?? `${normalizedName}@${faker.internet.domainName()}`;

    const confirmedAt = override?.confirmedAt ?? null;
    const createdAt = override?.createdAt ?? faker.date.past();
    const updatedAt = override?.updatedAt ?? createdAt;
    const deletedAt = override?.deletedAt ?? null;

    const password =
      override?.password ?? Password.fromHash(faker.string.alphanumeric(60));

    return User.hydrate(
      Object.assign(
        {
          id: faker.string.uuid(),
          name,
          email,
          password,
          confirmedAt,
          isActive: true,
          createdAt,
          updatedAt,
          deletedAt,
        },
        override,
      ),
    );
  }
}
