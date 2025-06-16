import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username : varchar ('username',{length : 255}).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const habits = pgTable('habits', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: integer('user_id').notNull().references(() => users.id),
});

export const habitEntries = pgTable('habit_entries', {
  id: serial('id').primaryKey(),
  habitId: integer('habit_id').notNull().references(() => habits.id),
  date: timestamp('date').notNull(),
  completed: boolean('completed').notNull().default(false),
});

export const habitCategories = pgTable('habit_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
});

export const streaks = pgTable('streaks', {
  id: serial('id').primaryKey(),
  habitId: integer('habit_id').notNull().references(() => habits.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  length: integer('length').notNull(),
});