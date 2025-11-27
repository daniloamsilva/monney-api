import { Test } from '@nestjs/testing';

import { AppModule } from '@src/app.module';
import { DatabaseService } from '@src/infrastructure/database/database.service';
import { USERS_REPOSITORY_PROVIDER } from '@src/infrastructure/repositories/postgres/users.repository';

export class TestSetup {
  static async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(new DatabaseService(true))
      .compile();

    const app = module.createNestApplication();

    await app.init();

    return {
      app,
      usersRepository: module.get(USERS_REPOSITORY_PROVIDER),
    };
  }
}
