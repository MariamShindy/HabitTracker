import { useEffect, useState } from 'react';
import { getHabitStats } from '../lib/api';
import { format, eachDayOfInterval } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ProgressChartProps {
  habitId: number;
  timeRange: { startDate: Date; endDate: Date };
}

interface HabitEntry {
  date: string;
  completed: boolean;
}

export const ProgressChart = ({ habitId, timeRange }: ProgressChartProps) => {
  const [data, setData] = useState<{ date: string; completed: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHabitStats(habitId, {
          startDate: timeRange.startDate.toISOString(),
          endDate: timeRange.endDate.toISOString(),
        });

        const baseDates = eachDayOfInterval({
          start: timeRange.startDate,
          end: timeRange.endDate,
        }).map((date) => ({
          date: format(date, 'MMM d'),
          completed: 0,
        }));

        const completedMap = new Map<string, number>(
          response.data.entries.map((entry: HabitEntry) => [
            format(new Date(entry.date), 'MMM d'),
            entry.completed ? 1 : 0,
          ])
        );

        const mergedData = baseDates.map((entry) => ({
          date: entry.date,
          completed: completedMap.get(entry.date) ?? 0,
        }));

        setData(mergedData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
  }, [habitId, timeRange]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Habit Progress
      </h1>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis ticks={[0, 1]} domain={[0, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
