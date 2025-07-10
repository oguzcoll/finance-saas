import { pgTable, text } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  playedId: text('played_id'),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
});
