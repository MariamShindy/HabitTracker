// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getHabitStats, toggleHabitDone } from "../lib/api";
// import { Button } from "@/components/ui/button";

// export default function HabitDetails() {
//   const { id } = useParams();
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     fetchStats();
//   }, [id]);

//   const fetchStats = async () => {
//     if (!id) return;
//     const today = new Date();
//     const startDate = new Date(today);
//     startDate.setDate(today.getDate() - 30); 

//   const stats = await getHabitStats(Number(id), {
//     startDate: startDate.toISOString(),
//     endDate: today.toISOString(),
//   });    setData(stats);
//   };

//   const handleToggle = async () => {
//     if (!id) return;
//     await toggleHabitDone(Number(id));
//     fetchStats();
//   };

//   if (!data) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Habit #{id}</h1>
//       <p className="text-muted-foreground">
//         Current Streak: {data.currentStreak} days
//       </p>
//       <p className="text-muted-foreground">
//         Longest Streak: {data.longestStreak} days
//       </p>
//       <p className="text-muted-foreground">
//         Completion Rate: {data.completionRate}%
//       </p>
//       <Button onClick={handleToggle}>Toggle Today</Button>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHabitStats, toggleHabitDone } from "../lib/api";
import { Button } from "@/components/ui/button";
import { DateSelector } from "../components/DateSelector";

export default function HabitDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  const fetchStats = async (range?: { startDate: Date; endDate: Date }) => {
    if (!id) return;

    const today = new Date();
    const endDate = range?.endDate ?? today;
    const startDate = range?.startDate ?? new Date(today.setDate(today.getDate() - 30));

    const stats = await getHabitStats(Number(id), {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    setData(stats);
  };

  useEffect(() => {
    fetchStats();
  }, [id]);

  const handleToggle = async () => {
    if (!id) return;
    await toggleHabitDone(Number(id));
    fetchStats(); 
  };

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    fetchStats(range); 
  };

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Habit #{id}</h1>

      <DateSelector onChange={handleDateChange} />

      <p className="text-muted-foreground">
        Current Streak: {data.currentStreak} days
      </p>
      <p className="text-muted-foreground">
        Longest Streak: {data.longestStreak} days
      </p>
      <p className="text-muted-foreground">
        Completion Rate: {data.completionRate}%
      </p>

      <Button onClick={handleToggle}>Toggle Today</Button>
    </div>
  );
}
