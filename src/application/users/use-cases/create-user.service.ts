import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { DomainEvent } from '@src/shared/domain/DomainEvent';
import { IUserRepository } from '@src/domain/users/repositories/user-repository.interface';
import { User } from '@src/domain/users/entities/user.entity';

export interface CreateUserUseCaseInput {
  email: string;
  name: string;
  password: string;
}

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserUseCaseInput): Promise<void> {
    const emailExists = await this.userRepository.findByEmail(input.email);

    if (emailExists) {
      throw new ConflictException('User email already exists');
    }

    const user = await User.create({
      email: input.email,
      name: input.name,
      plainTextPassword: input.password,
    });

    await this.userRepository.save(user);
    await DomainEvent.dispatch(user);
  }
}
