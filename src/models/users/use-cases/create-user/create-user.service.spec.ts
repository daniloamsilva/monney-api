import { HttpStatus } from '@nestjs/common';
import { Queue } from 'bullmq';

import { CreateUserService } from './create-user.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { QueuesService } from '@/infra/queues/queues.service';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let queuesService: QueuesService;
  let usersRepository: UsersInMemoryRepository;
  let confirmationEmailQueue: Queue;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();

    confirmationEmailQueue = {
      add: jest.fn(),
    } as unknown as Queue;

    queuesService = new QueuesService(confirmationEmailQueue, {} as Queue);
    createUserService = new CreateUserService(usersRepository, queuesService);
  });

  it('should not be able to create a new user with the an email already used', async () => {
    const user = await usersRepository.save(UserFactory.create());

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: user.email,
        password: 'pass1234',
        passwordConfirmation: 'pass1234',
      }),
    ).rejects.toThrow('User already exists');
  });

  it('should be able to create a new user successfully', async () => {
    const result = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'pass1234',
      passwordConfirmation: 'pass1234',
    });

    const newUser = await usersRepository.findByEmail('johndoe@email.com');
    const defaultWallet = usersRepository.findDefaultWalletByUserId(newUser.id);

    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('John Doe');
    expect(newUser.email).toBe('johndoe@email.com');
    expect(newUser.password).not.toBe('pass1234');
    expect(newUser.createdAt).not.toBeNull();
    expect(newUser.updatedAt).not.toBeNull();
    expect(newUser.deletedAt).toBeNull();
    expect(defaultWallet).toMatchObject({
      userId: newUser.id,
      name: 'Carteira',
      initialBalance: 0,
      isDefault: true,
    });

    expect(confirmationEmailQueue.add).toHaveBeenCalledTimes(1);

    expect(result).toMatchObject({
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    });
  });

  it('should rollback user creation when default wallet creation fails', async () => {
    usersRepository = new UsersInMemoryRepository({
      failOnDefaultWalletCreation: true,
    });
    createUserService = new CreateUserService(usersRepository, queuesService);

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'pass1234',
        passwordConfirmation: 'pass1234',
      }),
    ).rejects.toThrow('Default wallet creation failed');

    const newUser = await usersRepository.findByEmail('johndoe@email.com');

    expect(newUser).toBeUndefined();
    expect(confirmationEmailQueue.add).not.toHaveBeenCalled();
  });
});
