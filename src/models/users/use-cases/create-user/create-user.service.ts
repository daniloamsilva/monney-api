import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';
import { User } from '@/entities/user/user.entity';
import { Wallet } from '@/entities/wallet/wallet.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { WalletsRepositoryInterface } from '@/repositories/wallets/wallets.repository.interface';
import { Providers } from '@/repositories/providers.enum';
import { QueuesService } from '@/infra/queues/queues.service';
import { QueueType } from '@/infra/queues/queues.enum';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(Providers.WALLETS_REPOSITORY)
    private readonly walletsRepository: WalletsRepositoryInterface,
    private readonly queuesService: QueuesService,
  ) {}

  async execute(data: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    await this.usersRepository.save(user);

    const wallet = new Wallet({
      userId: user.id,
      name: 'Carteira',
      initialBalance: 0,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    await this.walletsRepository.save(wallet);

    await this.queuesService.execute({
      userId: user.id,
      queueType: QueueType.CONFIRMATION_EMAIL,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    };
  }
}
