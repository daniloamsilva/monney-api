import { fakerPT_BR as faker } from '@faker-js/faker';

import { User } from './user.entity';

export class UserFactory {
  static create(override?: Partial<User>): User {
    const name = override?.name ?? faker.person.fullName();

    const normalizedName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const email =
      override?.email ??
      `${normalizedName.toLowerCase().replace(/\s/g, '')}@${faker.internet.domainName()}`;

    const createdAt = override?.createdAt ?? faker.date.past();

    return new User(
      Object.assign(
        {
          name,
          email,
          password: faker.internet.password(),
          confirmed_at: null,
          createdAt,
          updatedAt: createdAt,
          deletedAt: null,
        },
        override,
      ),
    );
  }
}
