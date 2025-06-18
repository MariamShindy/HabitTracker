import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HabitForm } from "../components/HabitForm";
import { getHabit, updateHabit } from "../lib/api";

export default function EditHabit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<{ name: string } | null>(null); // use null initially

  useEffect(() => {
    if (id) {
      getHabit(Number(id)).then((res) => {
        console.log("Habit fetched:", res.data);
        setDefaultValues({ name: res.data.name });
      }).catch((err) => {
        console.error("Error fetching habit:", err);
      });
    }
  }, [id]);

  const handleSubmit = async (data: { name: string }) => {
    await updateHabit(Number(id), data);
    navigate("/Dashboard");
  };

  if (!defaultValues) {
    return <p className="text-center py-4">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
          Edit Habit
        </h2>
        <HabitForm onSubmit={handleSubmit} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
