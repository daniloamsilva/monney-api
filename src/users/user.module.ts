import { Module } from '@nestjs/common';

import { CreateUserService } from '@src/users/application/use-cases/create-user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CreateUserService],
})
export class UserModule {}
