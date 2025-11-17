import { CallHandler, Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { DatabaseService } from '@src/infrastructure/database/database.service';

@Injectable()
export class DatabaseTransactionInterceptor {
  constructor(private readonly databaseService: DatabaseService) {}

  async intercept(_: any, next: CallHandler): Promise<Observable<any>> {
    await this.databaseService.query('BEGIN;');

    return next
      .handle()
      .pipe(tap(async () => await this.databaseService.query('COMMIT;')));
  }
}
