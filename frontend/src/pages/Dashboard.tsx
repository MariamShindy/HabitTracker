// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getHabits, toggleHabitDone } from '../lib/api';
// import { HabitCard, Habit } from '../components/HabitCard';
// import { HabitForm } from '../components/HabitForm';
// import { ProgressChart } from '../components/ProgressChart';
// import { DateSelector } from '../components/DateSelector';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import { subDays } from 'date-fns';

// export const Dashboard = () => {
//   const [habits, setHabits] = useState<Habit[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [timeRange, setTimeRange] = useState({
//     startDate: subDays(new Date(), 7),
//     endDate: new Date(),
//   });

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const fetchHabits = async () => {
//     try {
//       setLoading(true);
//       const response = await getHabits();
//       setHabits(response.data);
//     } catch (error) {
//       console.error('Error fetching habits:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHabits();
//   }, []);

//   const handleHabitSaved = async () => {
//     setIsOpen(false);
//     setSelectedHabit(null);
//     await fetchHabits();
//   };

//   const handleEditHabit = (habit: Habit) => {
//     setSelectedHabit(habit);
//     setIsOpen(true);
//   };

//   const handleViewDetails = (habit: Habit) => {
//     setSelectedHabit(habit);
//     setIsDetailsOpen(true);
//   };

//   const handleToggleDone = async (habitId: string) => {
//     try {
//       await toggleHabitDone(habitId);
//       await fetchHabits();
//     } catch (err) {
//       console.error('Error toggling habit:', err);
//     }
//   };

//   const completedToday = (habit: Habit) =>
//     habit.habit_entries?.some(
//       (entry: { date: string; completed: boolean }) =>
//         new Date(entry.date).toDateString() ===
//           new Date().toDateString() && entry.completed
//     ) || false;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
//       {/* Header with title, logout, and add habit */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
//           HabitForge Dashboard
//         </h1>
//         <div className="flex gap-3">
//           <Button variant="outline" onClick={handleLogout}>
//             Logout
//           </Button>
//           <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//               <Button variant="default" onClick={() => setSelectedHabit(null)}>
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Habit
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-md">
//               <h2 className="text-xl font-semibold mb-4">
//                 {selectedHabit ? 'Edit Habit' : 'Create New Habit'}
//               </h2>
//               <HabitForm habit={selectedHabit} onSuccess={handleHabitSaved} />
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-700 dark:text-gray-200">Total Habits</p>
//           <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{habits.length}</p>
//         </div>
//         <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-700 dark:text-gray-200">Done Today</p>
//           <p className="text-2xl font-bold text-green-900 dark:text-green-100">
//             {habits.filter(completedToday).length}
//           </p>
//         </div>
//         <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-700 dark:text-gray-200">In Progress</p>
//           <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
//             {habits.length - habits.filter(completedToday).length}
//           </p>
//         </div>
//       </div>

//       {/* Habits List */}
//       {loading ? (
//         <div className="text-center py-20 text-gray-600 dark:text-gray-400">
//           Loading habits...
//         </div>
//       ) : habits.length === 0 ? (
//         <div className="text-center py-20 border rounded-lg bg-muted/50">
//           <p className="text-gray-600 dark:text-gray-400">
//             You haven’t added any habits yet.
//           </p>
//           <p className="text-sm text-gray-500 mt-2">
//             Click "Add Habit" to get started.
//           </p>
//         </div>
//       ) : (
//         <>
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2">
//             Your Habits
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {habits.map((habit) => (
//               <HabitCard
//                 key={habit.id}
//                 habit={habit}
//                 onEdit={handleEditHabit}
//                 onClick={handleViewDetails}
//                 completedToday={completedToday(habit)}
//                 onToggleDone={() => handleToggleDone(habit.id.toString())}
//               />
//             ))}
//           </div>
//         </>
//       )}

//       {/* Details Modal */}
//       <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
//         <DialogContent className="max-w-lg">
//           {selectedHabit && (
//             <>
//               <h2 className="text-xl font-semibold mb-4">
//                 {selectedHabit.name} Details
//               </h2>
//               <div className="space-y-4">
//                 <DateSelector onChange={setTimeRange} />
//                 <ProgressChart
//                   habitId={selectedHabit.id}
//                   timeRange={timeRange}
//                 />
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { getHabits } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Habit = {
  id: number;
  name: string;
};

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    getHabits().then((res) => setHabits(res.data));
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/create">
          <Button variant="default" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-600 text-white shadow-lg px-6 py-2 rounded-xl transition-all duration-300">
            + Add Habit
          </Button>
        </Link>
      </div>

      <ul className="max-w-md list-none space-y-6">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <li key={habit.id} className="py-3 sm:py-4">
              <Link
                to={`/habit/${habit.id}`}
                className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-indigo-400 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <span>📍</span>
                  <div className="flex items-center space-x-3 space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{habit.name}</p>
                    </div>
                  </div>
                  <span className="text-indigo-500 text-xl">➤</span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-muted-foreground pt-2">No habits yet.</p>
        )}
      </ul>
    </div>
  );
}
