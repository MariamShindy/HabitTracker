import { Router } from 'express';
import {
  createHabitHandler,
  getHabitsHandler,
  createHabitEntryHandler,
  getHabitStatsHandler,
  toggleHabitDoneHandler
} from '../controllers/habitController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/habits', createHabitHandler);
router.get('/habits', getHabitsHandler);
router.post('/habit-entries', createHabitEntryHandler);
router.get('/habits/:habitId/stats', getHabitStatsHandler);
router.post('/habits/:habitId/toggle', authMiddleware, toggleHabitDoneHandler);

export default router;