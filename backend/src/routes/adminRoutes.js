import { Router } from 'express';
import {
  analytics,
  createCourse,
  createCourseValidation,
  createMcq,
  createMcqValidation,
  createModule,
  createModuleValidation,
  createSubject,
  createSubjectValidation,
  createTaskType,
  createTaskTypeValidation,
  createTopic,
  createTopicValidation,
  paymentRecords,
  uploadImport,
  uploadMiddleware,
  users
} from '../controllers/adminController.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.post('/course', createCourseValidation, validate, createCourse);
router.post('/subject', createSubjectValidation, validate, createSubject);
router.post('/module', createModuleValidation, validate, createModule);
router.post('/topic', createTopicValidation, validate, createTopic);
router.post('/task-type', createTaskTypeValidation, validate, createTaskType);
router.post('/mcq', createMcqValidation, validate, createMcq);
router.post('/upload', uploadMiddleware, uploadImport);
router.get('/users', users);
router.get('/payments', paymentRecords);
router.get('/analytics', analytics);
export default router;
