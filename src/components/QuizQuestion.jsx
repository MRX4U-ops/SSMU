function QuizQuestion({
  item,
  index,
  total,
  selected,
  onSelect,
  lockAfterAnswer,
  explanation,
  showIndex = true,
}) {
  const answered = Boolean(selected);
  const isCorrect = selected === item.correctAnswer;

  return (
    <article className="card question-card">
      <h3>
        {showIndex ? `Q${index + 1}/${total}: ` : ''}
        {item.question}
      </h3>
      <div className="options">
        {item.options.map((option) => {
          const chosen = selected === option;
          const isCorrectOption = option === item.correctAnswer;
          let className = 'option';

          if (answered) {
            if (chosen && isCorrect) className += ' correct';
            if (chosen && !isCorrect) className += ' wrong';
            if (!chosen && !isCorrect && isCorrectOption) className += ' reveal-correct';
          }

          return (
            <button
              key={option}
              className={className}
              onClick={() => onSelect(option)}
              disabled={lockAfterAnswer && answered}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className={isCorrect ? 'success' : 'error'}>
          {isCorrect ? 'Correct ✅' : `Wrong ❌ – Correct answer: ${item.correctAnswer}`}
        </p>
      )}
      {answered && !isCorrect && (
        <div className="explanation-box">
          <strong>Explanation:</strong>
          <p>{explanation || 'Loading explanation...'}</p>
        </div>
      )}
    </article>
  );
}

export default QuizQuestion;
