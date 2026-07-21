import { CallHandler, Injectable } from '@nestjs/common';
import { from, lastValueFrom, Observable } from 'rxjs';

import { DatabaseService } from '@/infra/database/database.service';

@Injectable()
export class DatabaseTransactionInterceptor {
  constructor(private readonly databaseService: DatabaseService) {}

  async intercept(_: any, next: CallHandler): Promise<Observable<any>> {
    return from(
      this.databaseService.transaction(async () =>
        lastValueFrom(next.handle()),
      ),
    );
  }
}
