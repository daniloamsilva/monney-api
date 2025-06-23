import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';

@Injectable()
export class GetUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user.toJSON(),
    };
  }
}
