import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './models/database/database.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
})
export class AppModule {}
