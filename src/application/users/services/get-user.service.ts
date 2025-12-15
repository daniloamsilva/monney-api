import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { USERS_REPOSITORY_PROVIDER } from '@src/infrastructure/repositories/postgres/users.repository';

@Injectable()
export class GetUserService {
  constructor(
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly usersRepository: IUsersRepository,
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
