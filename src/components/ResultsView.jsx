function ResultsView({ questions, answers, explanations, onRestart }) {
  const total = questions.length;
  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;

  return (
    <section className="card">
      <h2>Results</h2>
      <p>Total questions: {total}</p>
      <p>Correct answers: {correct}</p>
      <p>Score: {percentage}%</p>

      <h3>Full Review</h3>
      {questions.map((q, index) => (
        <div key={q.id} className="review-item">
          <p>
            <strong>
              {index + 1}. {q.question}
            </strong>
          </p>
          <p>Your answer: {answers[q.id] || 'Not answered'}</p>
          <p>Correct answer: {q.correctAnswer}</p>
          <p>Explanation: {explanations[q.id] || 'No explanation'}</p>
        </div>
      ))}

      <button className="primary" type="button" onClick={onRestart}>
        Start Over
      </button>
    </section>
  );
}

export default ResultsView;
