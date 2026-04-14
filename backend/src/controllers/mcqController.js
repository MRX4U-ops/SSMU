import { body } from 'express-validator';
import { Attempt, Bookmark, MCQ } from '../models/index.js';

export const attemptValidation = [body('mcq_id').isString(), body('selected_option').isIn(['A', 'B', 'C', 'D'])];

export async function attemptQuestion(req, res) {
  const mcq = await MCQ.findById(req.body.mcq_id).lean();
  if (!mcq) return res.status(404).json({ message: 'MCQ not found' });
  const isCorrect = mcq.correct_option === req.body.selected_option;
  const attempt = await Attempt.create({
    user_id: req.user.sub,
    mcq_id: mcq._id,
    selected_option: req.body.selected_option,
    is_correct: isCorrect,
    timestamp: new Date()
  });
  return res.json({
    attempt,
    is_correct: isCorrect,
    correct_option: mcq.correct_option,
    explanation: mcq.explanation
  });
}

export async function history(req, res) {
  const attempts = await Attempt.find({ user_id: req.user.sub }).sort({ timestamp: -1 }).limit(300).populate('mcq_id').lean();
  res.json(attempts);
}

export const bookmarkValidation = [body('mcq_id').isString()];

export async function bookmark(req, res) {
  await Bookmark.updateOne({ user_id: req.user.sub, mcq_id: req.body.mcq_id }, { $setOnInsert: { user_id: req.user.sub, mcq_id: req.body.mcq_id } }, { upsert: true });
  res.json({ message: 'Bookmarked' });
}

export async function bookmarks(req, res) {
  const rows = await Bookmark.find({ user_id: req.user.sub }).populate('mcq_id').lean();
  res.json(rows);
}
