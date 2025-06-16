import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(8, 'username must be at leat 8 characters').optional()
});

export const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(100, 'Name too long'),
});

export const habitEntrySchema = z.object({
  habitId: z.number(),
  date: z.string().transform((str) => new Date(str)),
  completed: z.boolean(),
});