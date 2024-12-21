import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

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

  async query(query: string, params?: any[]) {
    const client = await this.pool.connect();

    try {
      return (await client.query(query, params)).rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
