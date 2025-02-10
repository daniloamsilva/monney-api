import { Inject, Injectable } from '@nestjs/common';

import { User } from '@/entities/user/user.entity';
import { UpdateNameRequestDto } from './update-name.request.dto';
import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UpdateNameReponseDto } from './update-name.response';

@Injectable()
export class UpdateNameService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(
    user: User,
    data: UpdateNameRequestDto,
  ): Promise<UpdateNameReponseDto> {
    user.name = data.name;
    await this.usersRepository.save(user);

    return {
      statusCode: 200,
      message: 'User name updated successfully',
    };
  }
}
