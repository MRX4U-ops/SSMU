import { Router } from 'express';
import { getCourses, getMcqs, getModules, getSubjects, getTaskTypes, getTopics } from '../controllers/contentController.js';

const router = Router();
router.get('/courses', getCourses);
router.get('/subjects/:course_id', getSubjects);
router.get('/modules/:subject_id', getModules);
router.get('/topics/:module_id', getTopics);
router.get('/task-types/:topic_id', getTaskTypes);
router.get('/mcqs/:task_type_id', getMcqs);
export default router;
