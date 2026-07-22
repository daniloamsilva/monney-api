import { HttpStatus } from '@nestjs/common';
import { Queue } from 'bullmq';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { WalletsRepositoryInterface } from '@/repositories/wallets/wallets.repository.interface';
import { CreateUserService } from './create-user.service';
import { UsersInMemoryRepository } from '@/repositories/users/users-in-memory.repository';
import { WalletsInMemoryRepository } from '@/repositories/wallets/wallets-in-memory.repository';
import { UserFactory } from '@/entities/user/user.factory';
import { QueuesService } from '@/infra/queues/queues.service';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let queuesService: QueuesService;
  let usersRepository: UsersRepositoryInterface;
  let walletsRepository: WalletsRepositoryInterface;
  let confirmationEmailQueue: Queue;

  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    walletsRepository = new WalletsInMemoryRepository();

    confirmationEmailQueue = {
      add: jest.fn(),
    } as unknown as Queue;

    queuesService = new QueuesService(confirmationEmailQueue, {} as Queue);
    createUserService = new CreateUserService(
      usersRepository,
      walletsRepository,
      queuesService,
    );
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
    const newWallets = await walletsRepository.findByUserId(newUser.id);

    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('John Doe');
    expect(newUser.email).toBe('johndoe@email.com');
    expect(newUser.password).not.toBe('pass1234');
    expect(newUser.createdAt).not.toBeNull();
    expect(newUser.updatedAt).not.toBeNull();
    expect(newUser.deletedAt).toBeNull();

    expect(newWallets.length).toBe(1);
    expect(newWallets[0].userId).toBe(newUser.id);
    expect(newWallets[0].name).toBe('Carteira');
    expect(newWallets[0].initialBalance).toBe(0);
    expect(newWallets[0].isDefault).toBe(true);
    expect(newWallets[0].createdAt).not.toBeNull();
    expect(newWallets[0].updatedAt).not.toBeNull();
    expect(newWallets[0].deletedAt).toBeNull();

    expect(confirmationEmailQueue.add).toHaveBeenCalledTimes(1);

    expect(result).toMatchObject({
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    });
  });
});
