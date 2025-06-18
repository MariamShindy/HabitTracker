import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface HabitCardProps {
  habit: {
    id: number;
    name: string;
    completed?: boolean; 
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
