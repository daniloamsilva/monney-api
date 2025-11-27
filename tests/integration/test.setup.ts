import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';

import { AppModule } from '@src/app.module';
import { DatabaseService } from '@src/infrastructure/database/database.service';
import { QueuesModule } from '@src/infrastructure/queues/queues.model';
import { QueuesModule as MockQueuesModule } from '../mocks/models/queue.module';
import { USERS_REPOSITORY_PROVIDER } from '@src/infrastructure/repositories/postgres/users.repository';
import { QueueType } from '@src/infrastructure/queues/queues.enum';

export class TestSetup {
  static async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(QueuesModule)
      .useModule(MockQueuesModule)
      .overrideProvider(DatabaseService)
      .useValue(new DatabaseService(true))
      .compile();

    const app = module.createNestApplication();
    await app.init();

    return {
      app,
      usersRepository: module.get(USERS_REPOSITORY_PROVIDER),
      emailConfirmationQueue: module.get(
        getQueueToken(QueueType.EMAIL_CONFIRMATION),
      ),
    };
  }
}
