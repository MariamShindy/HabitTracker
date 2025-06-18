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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Habit</h1>
      <HabitForm onSubmit={handleSubmit} defaultValues={defaultValues} />
    </div>
  );
}
