
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use environment variable or default to a fallback for development
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ollama';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
