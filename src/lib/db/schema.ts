
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  modelId: varchar('model_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: serial('chat_id').references(() => chats.id).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
