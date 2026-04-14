import { body } from 'express-validator';
import multer from 'multer';
import { AdminAction, Course, Import, MCQ, Module, Payment, Subject, TaskType, Topic, User, Attempt } from '../models/index.js';
import { parseUploadedFile } from '../services/importService.js';

const upload = multer({ dest: 'tmp/' });
export const uploadMiddleware = upload.single('file');

const id = () => body('title').optional().isString();
export const createCourseValidation = [body('title').isString().notEmpty()];
export const createSubjectValidation = [body('course_id').isString(), body('title').isString()];
export const createModuleValidation = [body('subject_id').isString(), body('title').isString()];
export const createTopicValidation = [body('module_id').isString(), body('title').isString()];
export const createTaskTypeValidation = [body('topic_id').isString(), body('type').isIn(['task_question', 'situational_task'])];
export const createMcqValidation = [
  body('task_type_id').isString(), body('question').isString(), body('option_a').isString(), body('option_b').isString(),
  body('option_c').isString(), body('option_d').isString(), body('correct_option').isIn(['A', 'B', 'C', 'D']), body('explanation').isString()
];

async function logAction(admin_user_id, action, target_type, target_id, metadata = {}) {
  await AdminAction.create({ admin_user_id, action, target_type, target_id, metadata });
}

export async function createCourse(req, res) { const row = await Course.create(req.body); await logAction(req.user.sub, 'create', 'course', row.id); res.json(row); }
export async function createSubject(req, res) { const row = await Subject.create(req.body); await logAction(req.user.sub, 'create', 'subject', row.id); res.json(row); }
export async function createModule(req, res) { const row = await Module.create(req.body); await logAction(req.user.sub, 'create', 'module', row.id); res.json(row); }
export async function createTopic(req, res) { const row = await Topic.create(req.body); await logAction(req.user.sub, 'create', 'topic', row.id); res.json(row); }
export async function createTaskType(req, res) { const row = await TaskType.create(req.body); await logAction(req.user.sub, 'create', 'task_type', row.id); res.json(row); }
export async function createMcq(req, res) { const row = await MCQ.create(req.body); await logAction(req.user.sub, 'create', 'mcq', row.id); res.json(row); }

export async function uploadImport(req, res) {
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  const parsed_payload = await parseUploadedFile(req.file);
  const file_type = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';
  const record = await Import.create({ file_name: req.file.originalname, file_type, parsed_payload, created_by: req.user.sub, status: 'previewed' });
  await logAction(req.user.sub, 'import_preview', 'import', record.id, { file: req.file.originalname });
  res.json(record);
}

export async function analytics(req, res) {
  const [totalUsers, activeSubscriptions, payments, attempts] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ subscription_status: 'active', subscription_end: { $gt: new Date() } }),
    Payment.countDocuments({ status: 'paid' }),
    Attempt.countDocuments()
  ]);
  res.json({ totalUsers, activeSubscriptions, payments, attempts });
}

export async function users(req, res) { res.json(await User.find().lean()); }
export async function paymentRecords(req, res) { res.json(await Payment.find().sort({ created_at: -1 }).lean()); }
