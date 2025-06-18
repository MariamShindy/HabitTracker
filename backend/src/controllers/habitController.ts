import { Request, Response } from 'express';
import { z } from 'zod';
import { createHabit, getUserHabits, 
  createHabitEntry , getHabitEntries , 
  calculateStreak , updateHabitById , 
  deleteHabitById } from '../db/queries';

const habitSchema = z.object({
  name: z.string().min(1).max(100),
});
const habitUpdateSchema = z.object({
  name: z.string().min(1),
});

const habitEntrySchema = z.object({
  habitId: z.number(),
  date: z.string().transform((str) => new Date(str)),
  completed: z.boolean(),
});

export const createHabitHandler = async (req: Request, res: Response) => {
  try {
    const { name } = habitSchema.parse(req.body);
    const userId = (req as any).user.userId; // From auth middleware
    const [habit] = await createHabit(name, userId);
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const getHabitsHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const habits = await getUserHabits(userId);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createHabitEntryHandler = async (req: Request, res: Response) => {
  try {
    const { habitId, date, completed } = habitEntrySchema.parse(req.body);
    const [entry] = await createHabitEntry(habitId, date, completed);
    await calculateStreak(habitId); // Update streak
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const getHabitStatsHandler = async (req: Request, res: Response) => {
  try {
    const habitId = z.number().parse(Number(req.params.habitId));
    const { startDate, endDate } = z
      .object({
        startDate: z.string().transform((str) => new Date(str)),
        endDate: z.string().transform((str) => new Date(str)),
      })
      .parse(req.query);

    const entries = await getHabitEntries(habitId, startDate, endDate);
    const { currentStreak, longestStreak } = await calculateStreak(habitId);

    const completionRate =
      entries.length > 0
        ? (entries.filter((e) => e.completed).length / entries.length) * 100
        : 0;

    res.json({
      entries,
      currentStreak,
      longestStreak,
      completionRate: Number(completionRate.toFixed(2)),
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const toggleHabitDoneHandler = async (req: Request, res: Response) => {
  try {
    const habitId = z.number().parse(Number(req.params.habitId));
    console.log('Toggle handler params:', req.params);
    // const userId = (req as any).user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [entry] = await getHabitEntries(habitId, today, today);

    if (entry) {
      const updatedEntry = await createHabitEntry(habitId, today, !entry.completed);
      await calculateStreak(habitId);
      return res.json(updatedEntry[0]);
    } else {
      const newEntry = await createHabitEntry(habitId, today, true);
      await calculateStreak(habitId);
      return res.status(201).json(newEntry[0]);
    }
  } catch (error) {
console.error('Toggle error:', error);
    return res.status(400).json({ error: 'Invalid request' });
  }
};

export const updateHabitHandler = async (req: Request, res: Response) => {
  try {
    const habitId = parseInt(req.params.habitId);
    const { name } = habitSchema.parse(req.body);
    const [updated] = await updateHabitById(habitId, name);

    if (!updated) return res.status(404).json({ error: 'Habit not found' });

    res.json({ message: 'Habit updated', habit: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid input' });
  }
};
export const getHabitByIdHandler = async (req: Request, res: Response) => {
  try {
    const habitId = parseInt(req.params.habitId);
    const habits = await getUserHabits((req as any).user.userId);
    const habit = habits.find((h) => h.id === habitId);

    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: 'Invalid input' });
  }
};
export const deleteHabitHandler = async (req: Request, res: Response) => {
  try {
    const habitId = parseInt(req.params.habitId);
    const [deleted] = await deleteHabitById(habitId);

    if (!deleted) return res.status(404).json({ error: "Habit not found" });

    res.json({ message: "Habit deleted", habit: deleted });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
};
