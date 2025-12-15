import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';

import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './application/users/users.module';
import { DomainErrorFilter } from './application/shared/filters/domain-error.filter';
import { ClassValidatorFilter } from './application/shared/filters/class-validator.filter';
import { QueuesModule } from './infrastructure/queues/queues.module';
import { AuthGuard } from './application/shared/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 10 }],
    }),
    DatabaseModule,
    QueuesModule,
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
