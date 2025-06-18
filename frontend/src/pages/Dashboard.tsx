import { useEffect, useState } from "react";
import { getHabits, getUserInfo, toggleHabitDone, deleteHabit } from "../lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


type Habit = {
  id: number;
  name: string;
  completedToday: boolean;
};

type User = {
  username: string;
  email: string;
};

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    getHabits().then((res) => setHabits(res.data));
    getUserInfo().then((res) => setUser(res.data));
  }, []);

  const handleToggleToday = async (habitId: number) => {
    await toggleHabitDone(habitId);
    const updated = await getHabits();
    setHabits(updated.data);
  };
  const handleDeleteHabit = async (habitId: number) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      await deleteHabit(habitId);
      const updated = await getHabits();
      setHabits(updated.data);
    } catch (error) {
      console.error("Failed to delete habit", error);
    }
  };

  return (
    <div>
      {user && (
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="/imgs/avatar.png"
                alt="Avatar"
                style={{ width: '70px', height: '70px', borderRadius: '9999px', marginRight: '15px' }}
              />
              <div>
                <h2 className="text-lg font-semibold">Welcome back, {user.username} 👋</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/create">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110 px-5 py-2 rounded-md text-sm font-medium shadow">
                  + Add Habit
                </Button>
              </Link>
              <Button className="text-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

        </Card>
      )}
      <div className="p-6 space-y-6">
        <Card className="p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Habits Performance</h2>
              <p className="text-muted-foreground text-sm">
                Your daily habit tracking overview
              </p>
            </div>
            <span className="text-muted-foreground text-sm">
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-muted-foreground">Assigned</th>
                  <th className="text-left py-2 px-4 text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-4 text-muted-foreground">Habit</th>
                  <th className="text-left py-2 px-4 text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {habits.length > 0 ? (
                  habits.map((habit) => (
                    <tr key={habit.id} className="border-b hover:bg-muted/50 transition">
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <div>
                          <p className="font-semibold">Habit {habit.id}</p>
                          <p className="text-muted-foreground text-xs">Personal Goal</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/habit/${habit.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {habit.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          size="sm"
                          variant={habit.completedToday ? "default" : "outline"}
                          onClick={() => handleToggleToday(habit.id)}
                        >
                          {habit.completedToday ? "✅ Done" : "☐ Mark"}
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <Link to={`/habit/${habit.id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteHabit(habit.id)}
                          >
                            Delete
                          </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      No habits yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}