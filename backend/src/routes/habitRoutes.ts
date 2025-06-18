import { Router } from 'express';
import {
  createHabitHandler,
  getHabitsHandler,
  createHabitEntryHandler,
  getHabitStatsHandler,
  toggleHabitDoneHandler,
  updateHabitHandler,
  getHabitByIdHandler,
  deleteHabitHandler
} from '../controllers/habitController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/habits', createHabitHandler);
router.get('/habits', getHabitsHandler);
router.post('/habit-entries', createHabitEntryHandler);
router.get('/habits/:habitId/stats', getHabitStatsHandler);
router.post('/habits/:habitId/toggle', authMiddleware, toggleHabitDoneHandler);
router.put('/habits/:habitId', updateHabitHandler);
router.get('/habits/:habitId', getHabitByIdHandler);
router.delete('/habits/:habitId', deleteHabitHandler);
export default router;