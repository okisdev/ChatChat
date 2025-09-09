import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/database/schema';
import { db } from '@/lib/database';
import { env } from '@/lib/env';

export const auth = betterAuth({
  secret: env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      chatchat_user: schema.user,
      chatchat_account: schema.account,
      chatchat_session: schema.session,
      chatchat_verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
