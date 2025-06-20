import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { QueuesModule } from '@/infra/queues/queues.module';
import { QueuesTestModule } from '@/infra/queues/queues-test.module';
import { DatabaseService } from '@/infra/database/database.service';
import { UsersRepositoryInterface } from '@/repositories/users/users.repository.interface';
import { User } from '@/entities/user/user.entity';
import { Providers } from '@/repositories/providers.enum';
import { UserFactory } from '@/entities/user/user.factory';

describe('UpdatePasswordController', () => {
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

  it('should not able to update password without authentication', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .send({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should not able to update password with an empty new password', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pass1234',
        newPassword: '',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toContain('newPassword should not be empty');
  });

  it('should not able to update password if current password is incorrect', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(response.body.message).toContain('Current password is incorrect');
  });

  it('should be able to update user password', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'pass1234',
        newPassword: 'newPassword123',
      });

    expect(response.status).toBe(HttpStatus.OK);
  });
});
