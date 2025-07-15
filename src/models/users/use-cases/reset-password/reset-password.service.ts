import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { TokenType } from '@/entities/token/token.entity';
import { ResetPasswordRequestDto } from './reset-password.request.dto';
import { ResetPasswordResponseDto } from './reset-password.response.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const validToken = await this.tokensRepository.findValidTokenByTokenAndType(
      token,
      TokenType.PASSWORD_RESET,
    );

    if (!validToken) {
      throw new NotFoundException('Token not found');
    }

    const user = await this.usersRepository.findById(validToken.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.changePassword(newPassword);
    await this.usersRepository.save(user);

    validToken.usedAt = new Date();
    await this.tokensRepository.save(validToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
    };
  }
}
