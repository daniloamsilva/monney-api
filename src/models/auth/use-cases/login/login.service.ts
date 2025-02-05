import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginRequestDto } from './login.request.dto';
import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Encryption } from '@/utils/encryption';
import { LoginResponseDto } from './login.response.dto';

@Injectable()
export class LoginService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const correctPassword = await Encryption.compare(
      data.password,
      user.password,
    );

    if (!correctPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        accessToken: {
          sub: user.id,
          email: user.email,
          exp: 0,
          iat: 0,
        },
      },
    };
  }
}
