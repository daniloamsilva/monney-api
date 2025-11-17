import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@src/app.module';
import { DatabaseService } from '@src/infrastructure/database/database.service';
import { Providers } from '@src/infrastructure/repositories/providers.enum';

export class TestSetup {
  static async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
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
      usersRepository: module.get(Providers.USERS_REPOSITORY),
    };
  }
}
