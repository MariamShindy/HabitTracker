import { useState, useEffect } from 'react';
import { createHabit, updateHabit } from '../lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Habit } from './HabitCard';

type HabitFormProps = {
  habit: Habit | null;
  onSuccess: () => void;
};

export const HabitForm = ({ habit, onSuccess }: HabitFormProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
    } else {
      setName('');
    }
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (habit) {
        await updateHabit(habit.id, { name });
      } else {
        await createHabit({ name });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        {habit ? 'Update Habit' : 'Create Habit'}
      </Button>
    </form>
  );
};
