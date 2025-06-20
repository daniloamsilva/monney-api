import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { DatabaseService } from '@/infra/database/database.service';
import { QueuesTestModule } from '@/infra/queues/queues-test.module';
import { QueuesModule } from '@/infra/queues/queues.module';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { Providers } from '@/repositories/providers.enum';
import { UserFactory } from '@/entities/user/user.factory';

describe('LoginController', () => {
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

  it('should not be able to login with a invalid email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid-format-email',
        password: 'password',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual(['email must be an email']);
  });

  it('should not be able to login with non-existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'non-existing@email.com',
        password: 'invalid_password',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toEqual('Invalid email or password');
  });

  it('should not be able to login with invalid password', async () => {
    const userPassword = 'pass1234';
    const user = await usersRepository.save(
      UserFactory.create({ password: userPassword }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'invalid_password',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toEqual('Invalid email or password');
  });

  it('should be able to login', async () => {
    const userPassword = 'pass1234';
    const user = await usersRepository.save(
      UserFactory.create({ password: userPassword }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: userPassword,
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toEqual('User logged in successfully');
    expect(response.body.data.accessToken).toBeDefined();
  });
});
