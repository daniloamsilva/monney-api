import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { UpdatePasswordRequestDto } from './update-password.request.dto';
import { UpdatePasswordResponseDto } from './update-password.response.dto';

@Injectable()
export class UpdatePasswordService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(
    id: string,
    data: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await user.checkPassword(data.currentPassword);
    if (!isPasswordCorrect) {
      throw new ForbiddenException('Current password is incorrect');
    }

    await user.changePassword(data.newPassword);
    await this.usersRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'User password updated successfully',
    };
  }
}
