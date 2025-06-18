import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and, gte, lte } from 'drizzle-orm';
import { users, habits, habitEntries, streaks } from './schema';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export const createUser = async (email: string, password: string , username: string) => {
  return db.insert(users).values({ email, password,username }).returning();
};

export const findUserByEmail = async (email: string) => {
  return db.select().from(users).where(eq(users.email, email)).limit(1);
};

export const createHabit = async (name: string, userId: number) => {
  return db.insert(habits).values({ name, userId }).returning();
};

export const getUserHabits = async (userId: number) => {
  return db.select().from(habits).where(eq(habits.userId, userId));
};

export const createHabitEntry = async (habitId: number, date: Date, completed: boolean) => {
  const existing = await db
    .select()
    .from(habitEntries)
    .where(
      and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.date, date)
      )
    );

  if (existing.length > 0) {
    return db
      .update(habitEntries)
      .set({ completed })
      .where(
        and(
          eq(habitEntries.habitId, habitId),
          eq(habitEntries.date, date)
        )
      )
      .returning();
  } else {
    return db
      .insert(habitEntries)
      .values({ habitId, date, completed })
      .returning();
  }
};
export const updateHabitById = async (id: number, name: string) => {
  return db
    .update(habits)
    .set({ name })
    .where(eq(habits.id, id))
    .returning();
};
export const getHabitEntries = async (habitId: number, startDate: Date, endDate: Date) => {
  return db
    .select()
    .from(habitEntries)
    .where(
      and(
        eq(habitEntries.habitId, habitId),
        gte(habitEntries.date, startDate),
        lte(habitEntries.date, endDate)
      )
    );
};

export const deleteHabitById = async (id: number) => {
    await db.delete(habitEntries).where(eq(habitEntries.habitId, id));
    await db.delete(streaks).where(eq(streaks.habitId, id));
  return db.delete(habits).where(eq(habits.id, id)).returning();
};
export const calculateStreak = async (habitId: number) => {
  const entries = await db
    .select()
    .from(habitEntries)
    .where(eq(habitEntries.habitId, habitId))
    .orderBy(habitEntries.date);

  let currentStreak = 0;
  let longestStreak = 0;
  let streakStart = new Date();

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].completed) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
      streakStart = new Date(entries[i].date);
    }
  }

  if (currentStreak > 0) {
    const existing = await db
      .select()
      .from(streaks)
      .where(eq(streaks.habitId, habitId));

    if (existing.length > 0) {
      await db
        .update(streaks)
        .set({
          length: currentStreak,
          startDate: streakStart,
        })
        .where(eq(streaks.habitId, habitId));
    } else {
      await db
        .insert(streaks)
        .values({
          habitId,
          startDate: streakStart,
          length: currentStreak,
        });
    }
  }

  return { currentStreak, longestStreak };
};
export const findUserById = async (id: number) => {
  return await db.select().from(users).where(eq(users.id, id)).limit(1); 
};
