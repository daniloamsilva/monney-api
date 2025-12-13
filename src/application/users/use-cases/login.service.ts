import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { USERS_REPOSITORY_PROVIDER } from '@src/infrastructure/repositories/postgres/users.repository';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';

@Injectable()
export class LoginService {
  constructor(
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordValid = await user.validatePassword(input.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken: token,
      },
    };
  }
}
