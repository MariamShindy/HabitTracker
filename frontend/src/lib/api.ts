import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const registerUser = (data: { email: string; password: string , username: string}) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const createHabit = (data: { name: string }) => api.post('/habits', data);

export const getHabits = () => api.get('/habits');
export const getHabit = (habitId: number) => api.get(`/habits/${habitId}`);

export const toggleHabitDone = async (habitId: number) => {
  console.log(`Habit ${habitId} toggled for today`);
  return await axios.post(`/api/habits/${habitId}/toggle`);
};

export const updateHabit = (habitId: number, data: { name: string }) =>
  api.put(`/habits/${habitId}`, data);

export const createHabitEntry = (data: {
  habitId: number;
  date: string;
  completed: boolean;
}) => api.post('/habit-entries', data);

export const getHabitStats = (
  habitId: number,
  params: { startDate: string; endDate: string }
) => api.get(`/habits/${habitId}/stats`, { params });