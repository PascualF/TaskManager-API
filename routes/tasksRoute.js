import { Router } from 'express';
const router = Router();

import { 
    getAllTasks, 
    getSpecificTask, 
    insertNewTask,
    updateTask, 
    deleteTask 
} from '../controllers/tasksController.js';

// This is import the middleware
import authMiddleware from '../middleware/auth.js';

router.use(authMiddleware)

router.route('/tasks').get(getAllTasks).post(insertNewTask)
router.route('/tasks/:taskID').get(getSpecificTask).patch(updateTask).delete(deleteTask)

export default router