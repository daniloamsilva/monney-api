import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
    private readonly jwtService: JwtService,
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

    const payload = { sub: user.id, email: user.email };

    return {
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        accessToken: await this.jwtService.signAsync(payload),
      },
    };
  }
}
