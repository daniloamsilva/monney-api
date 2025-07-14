import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { QueuesModule } from '@/infra/queues/queues.module';
import { QueuesTestModule } from '@/infra/queues/queues-test.module';
import { DatabaseService } from '@/infra/database/database.service';
import { User } from '@/entities/user/user.entity';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Providers } from '@/repositories/providers.enum';
import { UserFactory } from '@/entities/user/user.factory';

describe('ResendConfirmationEmailController', () => {
  let app: INestApplication;
  let user: User;
  let usersRepository: UsersRepositoryInterface;
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

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    usersRepository = module.get(Providers.USERS_REPOSITORY);

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

  it('should not be able to resend an email without authentication', async () => {
    const response = await request(app.getHttpServer()).post(
      '/users/resend-confirmation-email',
    );

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should be able to resend an email with a new token successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/resend-confirmation-email')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    });
  });

  it('should not be able to resend an email if user already confirmed their email', async () => {
    user.confirmedAt = new Date();
    await usersRepository.save(user);

    const response = await request(app.getHttpServer())
      .post('/users/resend-confirmation-email')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toEqual({
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'User already confirmed their email',
    });
  });
});
