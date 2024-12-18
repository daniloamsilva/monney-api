import { Module } from '@nestjs/common';

import { UsersModule } from './models/users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
