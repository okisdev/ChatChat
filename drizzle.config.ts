import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/lib/env';

config({
  path: '.env',
});

export default defineConfig({
  out: './database/migrations',
  schema: './database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
