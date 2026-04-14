import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/explain', async (req, res) => {
  const { question, correctAnswer, wrongAnswer } = req.body || {};
  if (!question || !correctAnswer || !wrongAnswer) {
    return res.status(400).json({ explanation: 'Missing question or answer data.' });
  }

  // Optional AI integration:
  // 1) If OPENAI_API_KEY is available, call your model here.
  // 2) Keep response short (2-3 lines) as required by the quiz UI.
  // This fallback is deterministic and offline-safe for local development.
  const explanation = `Correct: "${correctAnswer}" directly matches the concept tested in the question. ` +
    `"${wrongAnswer}" is incorrect because it does not satisfy the key condition asked. ` +
    `Review the question keywords and eliminate options that only partially fit.`;

  return res.json({ explanation });
});

app.listen(3001, () => {
  console.log('Explanation API running on http://localhost:3001');
});
