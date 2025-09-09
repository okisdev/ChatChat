import type {
  account,
  conversation,
  message,
  project,
  session,
  user,
  verification,
} from '@/database/schema';

export type Conversation = typeof conversation.$inferSelect;
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Message = typeof message.$inferSelect;
export type Project = typeof project.$inferSelect;
