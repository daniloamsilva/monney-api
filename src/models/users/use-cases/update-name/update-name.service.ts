import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateNameRequestDto } from './update-name.request.dto';
import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UpdateNameResponseDto } from './update-name.response.dto';

@Injectable()
export class UpdateNameService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(
    id: string,
    data: UpdateNameRequestDto,
  ): Promise<UpdateNameResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = data.name;
    await this.usersRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'User name updated successfully',
    };
  }
}
