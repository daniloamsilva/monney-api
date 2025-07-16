import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { QueuesModule } from '@/infra/queues/queues.module';
import { QueuesTestModule } from '@/infra/queues/queues-test.module';
import { DatabaseService } from '@/infra/database/database.service';
import { Providers } from '@/repositories/providers.enum';

export class TestHelper {
  static async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(QueuesModule)
      .useModule(QueuesTestModule)
      .overrideProvider(DatabaseService)
      .useValue(new DatabaseService(true))
      .compile();

    const app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    return {
      app,
      tokensRepository: module.get(Providers.TOKENS_REPOSITORY),
      usersRepository: module.get(Providers.USERS_REPOSITORY),
    };
  }
}
