import { fakerPT_BR as faker } from '@faker-js/faker';

import { User } from './user.entity';

export class UserFactory {
  static create(override?: Partial<User>): User {
    const name = override?.name ?? faker.person.fullName();

    const normalizedName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/gi, '');

    const email =
      override?.email ?? `${normalizedName}@${faker.internet.domainName()}`;

    const createdAt = override?.createdAt ?? faker.date.past();

    return new User(
      Object.assign(
        {
          name,
          email,
          password: faker.internet.password(),
          confirmedAt: null,
          createdAt,
          updatedAt: createdAt,
          deletedAt: null,
        },
        override,
      ),
    );
  }
}
