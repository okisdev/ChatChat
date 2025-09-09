import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const user = pgTable('chatchat_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}).enableRLS();

export const session = pgTable('chatchat_session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
}).enableRLS();

export const account = pgTable('chatchat_account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}).enableRLS();

export const verification = pgTable('chatchat_verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}).enableRLS();

// Project: groups many conversations
export const project = pgTable(
  'chatchat_project',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    visibility: text('visibility').notNull().default('private'),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => ({
    ownerIdx: index('idx_project_owner_id').on(table.ownerId),
    createdIdx: index('idx_project_created_at').on(table.createdAt),
  })
).enableRLS();

// Conversation: belongs to a project and a user (creator)
export const conversation = pgTable(
  'chatchat_conversation',
  {
    id: text('id').primaryKey(),
    title: text('title'),
    projectId: text('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
    createdById: text('created_by_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    visibility: text('visibility').notNull().default('private'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_conversation_project_id').on(table.projectId),
    index('idx_conversation_created_by_id').on(table.createdById),
    index('idx_conversation_created_at').on(table.createdAt),
  ]
).enableRLS();

// Message: belongs to a conversation
export const message = pgTable(
  'chatchat_message',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    parts: jsonb('parts').notNull(),
    attachments: jsonb('attachments'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_message_conversation_id').on(table.conversationId),
    index('idx_message_role').on(table.role),
    index('idx_message_created_at').on(table.createdAt),
  ]
).enableRLS();

// User preferences: stores user-specific settings as key-value pairs
export const userPreference = pgTable(
  'chatchat_user_preference',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_user_preference_user_id').on(table.userId),
    index('idx_user_preference_key').on(table.key),
    index('idx_user_preference_user_key').on(table.userId, table.key),
  ]
).enableRLS();
