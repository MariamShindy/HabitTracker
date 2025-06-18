import { useEffect, useState } from "react";
import axios from "axios";

export function useHabitStats(habitId: number, startDate: string, endDate: string) {
  const [stats, setStats] = useState<null | {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  }>(null);

  useEffect(() => {
    axios
      .get(`/api/habits/${habitId}/stats`, {
        params: { startDate, endDate },
        withCredentials: true,
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading stats:", err));
  }, [habitId, startDate, endDate]);

  return stats;
}
