import { useEffect, useState } from "react";
import { getHabits, getUserInfo, toggleHabitDone, deleteHabit } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Habit = {
  id: number;
  name: string;
  completedToday: boolean;
};

type User = {
  username: string;
  email: string;
};

const getTodayKey = () => {
  const today = new Date().toISOString().split("T")[0]; 
  return `completedHabits-${today}`;
};

const getLastVisitKey = () => "lastVisitedDate";

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const lastVisited = localStorage.getItem(getLastVisitKey());

      if (lastVisited && lastVisited !== today) {
        for (let key in localStorage) {
          if (key.startsWith("completedHabits-")) {
            localStorage.removeItem(key);
          }
        }
      }

      localStorage.setItem(getLastVisitKey(), today);

      const habitsRes = await getHabits();
      const localData = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

      const mergedHabits = habitsRes.data.map((habit: Habit) => ({
        ...habit,
        completedToday: localData.includes(habit.id),
      }));

      setHabits(mergedHabits);

      const userRes = await getUserInfo();
      setUser(userRes.data);
    };

    fetchData();
  }, []);
const handleToggleToday = async (habitId: number) => {
  await toggleHabitDone(habitId);

  const key = getTodayKey();
  const completed = JSON.parse(localStorage.getItem(key) || "[]");

  const isNowCompleted = !completed.includes(habitId);

  const updatedCompleted = isNowCompleted
    ? [...completed, habitId]
    : completed.filter((id: number) => id !== habitId);

  localStorage.setItem(key, JSON.stringify(updatedCompleted));

  setHabits((prevHabits) =>
    prevHabits.map((habit) =>
      habit.id === habitId
        ? { ...habit, completedToday: isNowCompleted }
        : habit
    )
  );
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
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "9999px",
                  marginRight: "15px",
                }}
              />
              <div>
                <h2 className="text-lg font-semibold">
                  Welcome back, {user.username} 👋
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/create">
                <Button className="cursor-pointer text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm  px-5 py-2 rounded-md text-sm font-medium shadow">
                  + Add Habit
                </Button>
              </Link>
              <Button
                className="cursor-pointer text-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="p-6 space-y-6">
        <Card className="p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground text-sm">
              Your daily habit tracking overview
            </p>
            <span className="text-muted-foreground text-sm">
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-muted-foreground">Habit No</th>
                  <th className="py-2 px-4 text-muted-foreground">Name</th>
                  <th className="py-2 px-4 text-muted-foreground">Completed</th>
                  <th className="py-2 px-4 text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {habits.length > 0 ? (
                  habits.map((habit) => (
                    <tr
                      key={habit.id}
                      className={`border-b hover:bg-muted/50 transition text-center ${habit.completedToday ? "bg-green-50 dark:bg-green-900/20" : ""
                        }`}
                    >

                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold">Habit {habit.id}</p>
                          <p className="text-muted-foreground text-xs">
                            Personal Goal
                          </p>
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
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={habit.completedToday}
                          onChange={() => handleToggleToday(habit.id)}
                          className="w-5 h-5 cursor-pointer accent-green-600"
                        />
                      </td>
                      <td className="px-4 py-4 space-x-2">
                        <Link to={`/habit/${habit.id}/edit`}>
                          <Button size="sm" variant="outline" className="cursor-pointer">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          className="cursor-pointer"
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
