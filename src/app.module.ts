import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { DatabaseModule } from './infrastructure/database/database.module';

import { UsersModule } from './api/users/users.module';
import { DomainErrorFilter } from './api/shared/filters/domain-error.filter';
import { ClassValidatorFilter } from './api/shared/filters/class-validator.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 10 }],
    }),
    DatabaseModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ClassValidatorFilter,
    },
  ],
})
export class AppModule {}
