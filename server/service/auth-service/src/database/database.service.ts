import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private db: NodePgDatabase<typeof schema>;
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool, { schema });
  }

  getDb() {
    return this.db;
  }

  async onModuleInit() {
    // Pool is automatically connected on first query
    // You can test connection here if needed
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
