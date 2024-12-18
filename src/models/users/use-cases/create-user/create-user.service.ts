import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';
import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Providers } from '../../providers.enum';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(data: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User(data);
    await this.usersRepository.save(user);

    return {
      message: 'User created successfully',
    };
  }
}
