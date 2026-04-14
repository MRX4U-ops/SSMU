const trimToTwoOrThreeLines = (text) => {
  const compact = text.replace(/\s+/g, ' ').trim();
  const sentences = compact.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 3).join(' ');
};

const getKeywords = (question) =>
  question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 6)
    .join(' ');

async function fetchInternetExplanation(question, correctAnswer, wrongAnswer) {
  const query = encodeURIComponent(`${getKeywords(question)} ${correctAnswer}`.trim());

  const searchResponse = await fetch(
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=1&namespace=0&format=json&origin=*`
  );

  if (!searchResponse.ok) {
    throw new Error('Search API failed');
  }

  const searchPayload = await searchResponse.json();
  const title = searchPayload?.[1]?.[0];
  if (!title) {
    return `Correct answer: ${correctAnswer}. "${wrongAnswer}" does not match the key concept asked in the question.`;
  }

  const summaryResponse = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );

  if (!summaryResponse.ok) {
    throw new Error('Summary API failed');
  }

  const summaryPayload = await summaryResponse.json();
  const extract = trimToTwoOrThreeLines(summaryPayload.extract || '');

  if (!extract) {
    return `Correct answer: ${correctAnswer}. "${wrongAnswer}" is not aligned with the topic definition.`;
  }

  return `${extract} So the correct choice is "${correctAnswer}", not "${wrongAnswer}".`;
}

async function fetchLocalExplanation({ question, correctAnswer, wrongAnswer }) {
  const response = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, correctAnswer, wrongAnswer }),
  });

  if (!response.ok) {
    throw new Error('No local explanation service available');
  }

  const data = await response.json();
  return trimToTwoOrThreeLines(data.explanation || 'Explanation unavailable');
}

export async function fetchExplanation({ question, correctAnswer, wrongAnswer }) {
  if (!navigator.onLine) {
    return 'Explanation unavailable offline';
  }

  try {
    return await fetchInternetExplanation(question, correctAnswer, wrongAnswer);
  } catch (internetError) {
    try {
      return await fetchLocalExplanation({ question, correctAnswer, wrongAnswer });
    } catch (localError) {
      return 'Explanation unavailable offline';
    }
  }
}
