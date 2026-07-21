import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;
  private readonly transactionStorage = new AsyncLocalStorage<PoolClient>();

  constructor(testEnvironment = false) {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(
        testEnvironment ? process.env.DB_TEST_PORT : process.env.DB_PORT,
      ),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
  }

  private async runQuery(client: PoolClient, query: string, params?: any[]) {
    return (await client.query(query, params)).rows;
  }

  async query(query: string, params?: any[]) {
    const transactionClient = this.transactionStorage.getStore();

    if (transactionClient) {
      try {
        return await this.runQuery(transactionClient, query, params);
      } catch (error) {
        console.error('Database query error:', error);
        throw error;
      }
    }

    const client = await this.pool.connect();

    try {
      return await this.runQuery(client, query, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const transactionClient = this.transactionStorage.getStore();

    if (transactionClient) {
      return callback();
    }

    const client = await this.pool.connect();

    try {
      await client.query('BEGIN;');

      const result = await this.transactionStorage.run(client, callback);

      await client.query('COMMIT;');
      return result;
    } catch (error) {
      await client.query('ROLLBACK;');
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
