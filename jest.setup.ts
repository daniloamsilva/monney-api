import * as dotenv from 'dotenv';
import { execSync } from 'node:child_process';

import { DatabaseService } from '@/models/database/database.service';

dotenv.config();

let isControllerTest = false;
let isDatabaseMigrated = false;

beforeAll(async () => {
  const currentTestName = expect.getState().testPath;
  isControllerTest = currentTestName.includes('controller.spec');

  if (isControllerTest && !isDatabaseMigrated) {
    execSync('npm run migration:up', {
      env: {
        DATABASE_URL: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_TEST_PORT}/${process.env.DB_DATABASE}`,
      },
    });
    isDatabaseMigrated = true;
  }
});

afterAll(async () => {
  if (isControllerTest) {
    const database = new DatabaseService(true);

    const tables = await database.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name != 'migrations';  
    `);

    for (const table of tables) {
      await database.query(`TRUNCATE TABLE ${table.table_name} CASCADE`);
    }

    await database.onModuleDestroy();
  }
});
