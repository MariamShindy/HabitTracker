// import { Button } from '@/components/ui/button';

// export type Habit = {
//   id: number;
//   name: string;
//   habit_entries?: {
//     date: string;
//     completed: boolean;
//   }[];
// };

// export type HabitCardProps = {
//   habit: Habit;
//   onEdit: (habit: Habit) => void;
//   onClick: (habit: Habit) => void;
//   completedToday: boolean;
//   onToggleDone?: () => void;
// };

// export const HabitCard = ({ habit, onEdit, onClick, completedToday, onToggleDone }: HabitCardProps) => {
//   return (
//     <div 
//       className="p-4 rounded shadow bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//       onClick={() => onClick(habit)}
//     >
//       <h3 className="text-lg font-semibold">{habit.name}</h3>

//       <Button
//         variant={completedToday ? 'secondary' : 'default'}
//         onClick={(e) => {
//           e.stopPropagation();  
//           onToggleDone?.();
//         }}
//         className="mt-2"
//       >
//         {completedToday ? 'Undo Today' : 'Mark as Done Today'}
//       </Button>

//       <p className="text-sm mt-1">
//         {completedToday ? 'Completed today' : 'Not completed today'}
//       </p>

//       <button
//         onClick={(e) => {
//           e.stopPropagation();  
//           onEdit(habit);
//         }}
//         className="text-blue-500 mt-2 underline"
//       >
//         Edit
//       </button>
//     </div>
//   );
// };

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface HabitCardProps {
  habit: {
    id: number;
    name: string;
    completed?: boolean; // optional if not included yet
  };
}

export const HabitCard = ({ habit }: HabitCardProps) => (
  <Link to={`/habit/${habit.id}`}>
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between">
          {habit.name}
          {habit.completed && (
            <span className="text-green-500 text-sm">✔</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent />
    </Card>
  </Link>
);
