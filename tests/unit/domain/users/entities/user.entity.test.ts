import { User } from '@src/domain/users/entities/user.entity';
import { Email } from '@src/domain/users/value-objects/email.vo';
import { Password } from '@src/domain/users/value-objects/password.vo';
import { UserCreatedEvent } from '@src/domain/users/events/user-created.event';

describe('UserEntity', () => {
  it('should create a new user with valid data', async () => {
    const props = {
      email: 'test@example.com',
      name: 'Test User',
      plainTextPassword: 'password123',
    };

    const user = await User.create(props);

    expect(user).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          id: expect.any(String),
          email: expect.objectContaining({
            props: { value: 'test@example.com' },
          }),
          name: 'Test User',
          password: expect.any(Password),
          isActive: true,
          tokens: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      }),
    );
    expect(user.confirmedAt).toBeUndefined();
    expect(user.deletedAt).toBeUndefined();
  });

  it('should add UserCreatedEvent to domain events', async () => {
    const props = {
      email: 'test@example.com',
      name: 'Test User',
      plainTextPassword: 'password123',
    };

    const user = await User.create(props);

    expect(user.domainEvents).toHaveLength(1);
    expect(user.domainEvents[0]).toBeInstanceOf(UserCreatedEvent);
    expect(user.domainEvents[0].getAggregateId()).toBe(user.id);
    expect((user.domainEvents[0] as UserCreatedEvent).email).toBe(
      'test@example.com',
    );
    expect((user.domainEvents[0] as UserCreatedEvent).name).toBe('Test User');
  });

  it('should generate unique IDs for different users', async () => {
    const props1 = {
      email: 'user1@example.com',
      name: 'User 1',
      plainTextPassword: 'password123',
    };
    const props2 = {
      email: 'user2@example.com',
      name: 'User 2',
      plainTextPassword: 'password456',
    };

    const user1 = await User.create(props1);
    const user2 = await User.create(props2);

    expect(user1.id).not.toBe(user2.id);
  });

  it('should hydrate user from existing data', () => {
    const email = Email.create('test@example.com');
    const password = Password.fromHash('$2b$10$hashedpassword');
    const props = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: email,
      name: 'Test User',
      password: password,
      isActive: true,
      confirmedAt: new Date('2024-01-01'),
      tokens: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      deletedAt: null,
    };

    const user = User.hydrate(props);

    expect(user).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: expect.objectContaining({
            props: { value: 'test@example.com' },
          }),
          name: 'Test User',
          password: expect.objectContaining({
            props: { value: '$2b$10$hashedpassword' },
          }),
          isActive: true,
          tokens: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
          confirmedAt: new Date('2024-01-01'),
          deletedAt: null,
        }),
      }),
    );

    expect(user.domainEvents).toHaveLength(0);
  });

  it('should hydrate user with optional fields undefined', () => {
    const email = Email.create('test@example.com');
    const password = Password.fromHash('$2b$10$hashedpassword');
    const props = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: email,
      name: 'Test User',
      password: password,
      isActive: false,
      tokens: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    const user = User.hydrate(props);

    expect(user).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: expect.objectContaining({
            props: { value: 'test@example.com' },
          }),
          name: 'Test User',
          password: expect.objectContaining({
            props: { value: '$2b$10$hashedpassword' },
          }),
          isActive: false,
          tokens: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        }),
      }),
    );
    expect(user.confirmedAt).toBeUndefined();
    expect(user.deletedAt).toBeUndefined();
  });
});
