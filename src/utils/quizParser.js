const normalizeQuestion = (text) =>
  text
    .replace(/\s+/g, ' ')
    .replace(/^\d+[.)-]\s*/, '')
    .trim();

const normalizeOption = (text) => text.replace(/\s+/g, ' ').trim();

export const shuffleArray = (items) => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

export function parseMCQText(text) {
  const matches = [...text.matchAll(/([\s\S]*?)\{([^{}]+)\}/g)];
  const seenQuestions = new Set();
  const parsed = [];
  const warnings = [];

  matches.forEach((match) => {
    const rawQuestion = normalizeQuestion(match[1].split('\n').slice(-2).join(' '));
    const rawOptions = match[2]
      .split('~')
      .map((option) => option.trim())
      .filter(Boolean);

    if (!rawQuestion || rawOptions.length < 2) {
      warnings.push('Skipped malformed MCQ block.');
      return;
    }

    const correctRaw = rawOptions.find((option) => option.startsWith('='));
    if (!correctRaw) {
      warnings.push(`Skipped question (missing '=' correct answer marker): ${rawQuestion}`);
      return;
    }

    const options = rawOptions.map((option) => normalizeOption(option.replace(/^=/, '')));
    const correctAnswer = normalizeOption(correctRaw.replace(/^=/, ''));

    if (seenQuestions.has(rawQuestion)) {
      warnings.push(`Duplicate ignored: ${rawQuestion}`);
      return;
    }

    seenQuestions.add(rawQuestion);
    parsed.push({
      id: `${parsed.length}-${rawQuestion.slice(0, 24)}`,
      question: rawQuestion,
      options,
      correctAnswer,
    });
  });

  return { questions: parsed, warnings };
}
