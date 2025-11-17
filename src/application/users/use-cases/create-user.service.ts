import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { DomainEvent } from '@src/shared/domain/DomainEvent';
import { IUsersRepository } from '@src/domain/users/repositories/users-repository.interface';
import { User } from '@src/domain/users/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Providers } from '@src/infrastructure/repositories/providers.enum';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(Providers.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(input: CreateUserDto): Promise<void> {
    const emailExists = await this.usersRepository.findByEmail(input.email);

    if (emailExists) {
      throw new ConflictException('User email already exists');
    }

    const user = await User.create({
      email: input.email,
      name: input.name,
      plainTextPassword: input.password,
    });

    await this.usersRepository.save(user);
    await DomainEvent.dispatch(user);
  }
}
