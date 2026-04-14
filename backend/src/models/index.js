import mongoose from 'mongoose';

const baseOptions = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } };

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  google_id: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  subscription_status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  subscription_start: Date,
  subscription_end: Date,
  last_login_at: Date,
  active_device_id: { type: String, default: null }
}, baseOptions);

const CourseSchema = new mongoose.Schema({ title: { type: String, required: true, unique: true } }, baseOptions);
const SubjectSchema = new mongoose.Schema({ course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, title: { type: String, required: true } }, baseOptions);
const ModuleSchema = new mongoose.Schema({ subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, title: { type: String, required: true } }, baseOptions);
const TopicSchema = new mongoose.Schema({ module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, title: { type: String, required: true } }, baseOptions);

const TaskTypeSchema = new mongoose.Schema({
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  type: { type: String, enum: ['task_question', 'situational_task'], required: true }
}, baseOptions);

const MCQSchema = new mongoose.Schema({
  task_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskType', required: true },
  question: { type: String, required: true },
  option_a: { type: String, required: true },
  option_b: { type: String, required: true },
  option_c: { type: String, required: true },
  option_d: { type: String, required: true },
  correct_option: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  tags: [{ type: String }],
  published: { type: Boolean, default: true }
}, baseOptions);

const PaymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_id: { type: String, required: true, unique: true },
  payment_id: String,
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  verified_at: Date,
  subscription_start: Date,
  subscription_end: Date,
  gateway_metadata: { type: Object, default: {} }
}, baseOptions);

const AttemptSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mcq_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MCQ', required: true },
  selected_option: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  is_correct: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
}, baseOptions);

const BookmarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mcq_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MCQ', required: true }
}, baseOptions);
BookmarkSchema.index({ user_id: 1, mcq_id: 1 }, { unique: true });

const ImportSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, enum: ['pdf', 'docx'], required: true },
  status: { type: String, enum: ['uploaded', 'previewed', 'validated', 'published'], default: 'uploaded' },
  parsed_payload: { type: Object, default: {} },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, baseOptions);

const AdminActionSchema = new mongoose.Schema({
  admin_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target_type: { type: String, required: true },
  target_id: String,
  metadata: { type: Object, default: {} }
}, baseOptions);

export const User = mongoose.model('User', UserSchema);
export const Course = mongoose.model('Course', CourseSchema);
export const Subject = mongoose.model('Subject', SubjectSchema);
export const Module = mongoose.model('Module', ModuleSchema);
export const Topic = mongoose.model('Topic', TopicSchema);
export const TaskType = mongoose.model('TaskType', TaskTypeSchema);
export const MCQ = mongoose.model('MCQ', MCQSchema);
export const Payment = mongoose.model('Payment', PaymentSchema);
export const Attempt = mongoose.model('Attempt', AttemptSchema);
export const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
export const Import = mongoose.model('Import', ImportSchema);
export const AdminAction = mongoose.model('AdminAction', AdminActionSchema);
