import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import CreateHabit from './pages/CreateHabit';
import Dashboard from './pages/Dashboard';
import HabitDetails from './pages/HabitDetails';
import EditHabit from './pages/EditHabit';
import NotFound from "./pages/NotFound";
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateHabit />} />
        <Route path="/habit/:id" element={<HabitDetails />} />
        <Route path="/habit/:id/edit" element={<EditHabit />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}