import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: DatabaseService,
      useValue: new DatabaseService(),
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
