import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { AppModule } from '@/app.module';
import { QueuesModule } from '@/infra/queues/queues.module';
import { QueuesTestModule } from '@/infra/queues/queues-test.module';
import { DatabaseService } from '@/infra/database/database.service';
import { Providers } from '@/repositories/providers.enum';
import { User } from '@/entities/user/user.entity';
import { UserFactory } from '@/entities/user/user.factory';

describe('UpdateNameController', () => {
  let app: INestApplication;
  let usersRepository: UsersRepositoryInterface;
  let user: User;
  let accessToken: string;

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

    user = await usersRepository.save(
      UserFactory.create({ password: 'pass1234' }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'pass1234',
      });

    accessToken = response.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to update user name without authentication', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/name')
      .send({
        name: 'Updated Name',
      });

    expect(response.status).toBe(401);
  });

  it('should not able to update user name with an empty name', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/name')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
  });

  it('should be able to update user name', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/name')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Name',
      });

    const updatedUser = await usersRepository.findById(user.id);

    expect(response.status).toBe(200);
    expect(updatedUser.name).toBe('Updated Name');
  });
});
