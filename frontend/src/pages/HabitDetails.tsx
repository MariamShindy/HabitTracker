import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHabit, getHabitStats, toggleHabitDone } from "../lib/api";
import { Button } from "@/components/ui/button";
import { DateSelector } from "../components/DateSelector";
import { ProgressChart } from "../components/ProgressChart";

type Stats = {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  entries: Array<{ id: number; habitId: number; date: string; completed: boolean }>;
};

type Habit = {
  id: number;
  name: string;
};

export default function HabitDetails() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Stats | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);

  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),  
    endDate: new Date(),
  });

  const fetchStatsAndHabit = async (range = selectedRange) => {
    if (!id) return;
    const habitId = Number(id);

    try {
      const [statsRes, habitRes] = await Promise.all([
        getHabitStats(habitId, {
          startDate: range.startDate.toISOString(),
          endDate: range.endDate.toISOString(),
        }),
        getHabit(habitId),
      ]);

      setData(statsRes.data);
      setHabit(habitRes.data);
    } catch (error) {
      console.error("Failed to fetch habit or stats:", error);
    }
  };

  useEffect(() => {
    fetchStatsAndHabit();
  }, [id, selectedRange]);

  const handleToggle = async () => {
    if (!id) return;
    await toggleHabitDone(Number(id));
    fetchStatsAndHabit();
  };

  if (!data || !habit) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full h-100 p-4">
          <ProgressChart habitId={Number(id)} timeRange={selectedRange} />
        </div>

        <div className="p-5 text-center flex flex-col items-center">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {habit.name}
          </h5>
          <span className="text-sm text-muted-foreground dark:text-gray-400">Habit ID: #{id}</span>

          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 space-y-1 mt-2">
            <span>🔥 Current Streak: {data.currentStreak} days</span><br />
            <span>🏆 Longest Streak: {data.longestStreak} days</span><br />
            <span>📊 Completion Rate: {data.completionRate.toFixed(2)}%</span>
          </p>

          <DateSelector onChange={(r) => setSelectedRange(r)} />

        </div>
      </div>
    </div>
  );
}
