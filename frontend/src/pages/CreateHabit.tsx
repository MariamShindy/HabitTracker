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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
          Create a New Habit
        </h2>
        <HabitForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
