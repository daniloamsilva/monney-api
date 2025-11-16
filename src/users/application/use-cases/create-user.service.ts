import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { IUserRepository } from '@src/users/domain/repositories/user-repository.interface';
import { User } from '@src/users/domain/entities/User';
import { DomainEvent } from '@src/shared/domain/DomainEvent';

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
