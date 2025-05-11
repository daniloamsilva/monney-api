import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';
import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { TokenType } from '@/entities/token/token.entity';
import { Providers } from '@/repositories/providers.enum';
import { SendEmailService } from '@/models/tokens/use-cases/send-email/send-email.service';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute(data: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    await this.usersRepository.save(user);

    await this.sendEmailService.execute({
      userId: user.id,
      tokenType: TokenType.CONFIRMATION_EMAIL,
    });

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }
}
