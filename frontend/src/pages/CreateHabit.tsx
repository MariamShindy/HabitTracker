import { HabitForm } from "../components/HabitForm";
import { createHabit } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function CreateHabit() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await createHabit(data);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Create a New Habit
      </h2>
      <HabitForm onSubmit={handleSubmit} />
    </div>
  );
}
