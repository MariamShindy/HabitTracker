// import { useEffect, useState } from 'react';
// import { getHabitStats } from '../lib/api';
// import { format } from 'date-fns';

// interface ProgressChartProps {
//   habitId: number;
//   timeRange: { startDate: Date; endDate: Date };
// }

// interface HabitEntry {
//   date: string;
//   completed: boolean;
// }

// export const ProgressChart = ({ habitId, timeRange }: ProgressChartProps) => {
//   const [data, setData] = useState<{ date: string; completed: number }[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getHabitStats(habitId, {
//           startDate: timeRange.startDate.toISOString(),
//           endDate: timeRange.endDate.toISOString(),
//         });

//         const entries = response.data.entries.map((entry: HabitEntry) => ({
//           date: format(new Date(entry.date), 'yyyy-MM-dd'),
//           completed: entry.completed ? 1 : 0,
//         }));

//         setData(entries);
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       }
//     };

//     fetchData();
//   }, [habitId, timeRange]);

//   return (
//     <div>
//       <h2>Habit Progress</h2>
//       <ul>
//         {data.map((item) => (
//           <li key={item.date}>
//             {item.date}: {item.completed ? '✅' : '❌'}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
