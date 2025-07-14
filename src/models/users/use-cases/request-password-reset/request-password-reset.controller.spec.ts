import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { QueuesModule } from '@/infra/queues/queues.module';
import { QueuesTestModule } from '@/infra/queues/queues-test.module';
import { DatabaseService } from '@/infra/database/database.service';
import { Providers } from '@/repositories/providers.enum';
import { UserFactory } from '@/entities/user/user.factory';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';

describe('RequestPasswordResetController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(QueuesModule)
      .useModule(QueuesTestModule)
      .overrideProvider(DatabaseService)
      .useValue(new DatabaseService(true))
      .compile();

    usersRepository = module.get(Providers.USERS_REPOSITORY);

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to request password reset without email', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({});

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should not be able to request password reset with invalid email', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should be able to request password reset with valid email', async () => {
    const user = await usersRepository.save(UserFactory.create());

    const response = await request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({ email: user.email });

    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
