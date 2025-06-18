import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHabitStats, toggleHabitDone } from "../lib/api";
import { Button } from "@/components/ui/button";
import { DateSelector } from "../components/DateSelector";
import { ProgressChart } from "../components/ProgressChart";

type Stats = {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  entries: Array<{ id: number; habitId: number; date: string; completed: boolean }>;
};

export default function HabitDetails() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Stats | null>(null);

  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    endDate: new Date(),
  });

  const fetchStats = async (range = selectedRange) => {
    if (!id) return;
    const { data: stats } = await getHabitStats(Number(id), {
      startDate: range.startDate.toISOString(),
      endDate: range.endDate.toISOString(),
    });
    console.log("Fetched stats payload:", stats);
    setData(stats);
  };

  useEffect(() => {
    fetchStats();
  }, [id, selectedRange]);

  const handleToggle = async () => {
    if (!id) return;
    await toggleHabitDone(Number(id));
    fetchStats();
  };

  if (!data) return <p className="p-4">Loading...</p>;

  return (
   <div className="flex justify-center p-6">
  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <img
      className="rounded-t-lg w-full h-80 object-cover"
      src="/imgs/habit.png"
      alt="Habit"
    />
    <div className="p-5 text-center flex flex-col items-center">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Habit #{id}
      </h5>

      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 space-y-1">
        <span>🔥 Current Streak: {data.currentStreak} days</span><br />
        <span>🏆 Longest Streak: {data.longestStreak} days</span><br />
        <span>📊 Completion Rate: {data.completionRate.toFixed(2)}%</span>
      </p>

      <DateSelector onChange={(r) => setSelectedRange(r)} />

      <Button
        onClick={handleToggle}
        className="mt-4 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        ✅ Toggle Today
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </Button>
    </div>
  </div>
</div>

  );
}
