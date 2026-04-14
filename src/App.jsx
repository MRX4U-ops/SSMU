import { useMemo, useState } from 'react';
import PdfUploader from './components/PdfUploader';
import QuizQuestion from './components/QuizQuestion';
import ResultsView from './components/ResultsView';
import DebugPanel from './components/DebugPanel';
import { shuffleArray } from './utils/quizParser';
import { fetchExplanation } from './utils/explanationApi';
import { courseCatalog } from './data/courseCatalog';

function App() {
  const [parsed, setParsed] = useState({ questions: [], warnings: [] });
  const [answers, setAnswers] = useState({});
  const [explanations, setExplanations] = useState({});
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState('single');
  const [showResults, setShowResults] = useState(false);
  const [lockAfterAnswer, setLockAfterAnswer] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseCatalog[0].course);
  const [selectedSubject, setSelectedSubject] = useState(courseCatalog[0].subjects[0]);
  const [quizStarted, setQuizStarted] = useState(false);

  const availableSubjects = useMemo(
    () => courseCatalog.find((entry) => entry.course === selectedCourse)?.subjects || [],
    [selectedCourse]
  );

  const quiz = useMemo(
    () =>
      parsed.questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      })),
    [parsed.questions]
  );

  const answeredCount = Object.keys(answers).length;
  const progress = quiz.length ? Math.round((answeredCount / quiz.length) * 100) : 0;

  const startQuiz = () => {
    setAnswers({});
    setExplanations({});
    setCurrent(0);
    setShowResults(false);
    setQuizStarted(true);
  };

  const onParsed = (result) => {
    setParsed(result);
    setQuizStarted(false);
    setAnswers({});
    setExplanations({});
    setCurrent(0);
    setShowResults(false);
  };

  const onCourseChange = (courseName) => {
    const firstSubject = courseCatalog.find((entry) => entry.course === courseName)?.subjects[0] || '';
    setSelectedCourse(courseName);
    setSelectedSubject(firstSubject);
    setQuizStarted(false);
    setAnswers({});
    setExplanations({});
    setCurrent(0);
  };

  const recordAnswer = async (question, choice) => {
    if (lockAfterAnswer && answers[question.id]) return;

    setAnswers((prev) => ({ ...prev, [question.id]: choice }));

    if (choice !== question.correctAnswer && !explanations[question.id]) {
      const explanation = await fetchExplanation({
        question: question.question,
        correctAnswer: question.correctAnswer,
        wrongAnswer: choice,
      });
      setExplanations((prev) => ({ ...prev, [question.id]: explanation }));
    }
  };

  const resetAll = () => {
    setParsed({ questions: [], warnings: [] });
    setAnswers({});
    setExplanations({});
    setCurrent(0);
    setShowResults(false);
    setQuizStarted(false);
  };

  return (
    <main className="app">
      <header>
        <h1>PDF MCQ Practice Platform</h1>
      </header>

      <section className="card">
        <h2>Course & Subject</h2>
        <div className="row">
          <label>
            Course
            <select value={selectedCourse} onChange={(e) => onCourseChange(e.target.value)}>
              {courseCatalog.map((entry) => (
                <option key={entry.course} value={entry.course}>
                  {entry.course}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subject
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              {availableSubjects.map((subject, idx) => (
                <option key={`${subject}-${idx}`} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {!quiz.length && <PdfUploader onParsed={onParsed} />}

      {!!quiz.length && !quizStarted && (
        <section className="card">
          <h3>Ready to start?</h3>
          <p>
            Selected path: <strong>{selectedCourse}</strong> → <strong>{selectedSubject}</strong>
          </p>
          <p>Starting quiz will clear all previous answers and begin from question 1.</p>
          <button className="primary" onClick={startQuiz}>
            Start Quiz
          </button>
        </section>
      )}

      {!!quiz.length && quizStarted && !showResults && (
        <>
          <section className="card controls">
            <p>
              <strong>{selectedCourse}</strong> • {selectedSubject}
            </p>
            <div className="row">
              <button className={mode === 'single' ? 'primary' : ''} onClick={() => setMode('single')}>
                One-by-one mode
              </button>
              <button className={mode === 'list' ? 'primary' : ''} onClick={() => setMode('list')}>
                Full list mode
              </button>
              <button className={debugMode ? 'primary' : ''} onClick={() => setDebugMode((v) => !v)}>
                Admin / Debug
              </button>
            </div>
            <div className="row">
              <label>
                <input
                  type="checkbox"
                  checked={lockAfterAnswer}
                  onChange={(event) => setLockAfterAnswer(event.target.checked)}
                />
                Lock after first answer
              </label>
              <button onClick={() => setShowResults(true)}>Finish & View Results</button>
            </div>
            <div className="progress-wrap">
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>
            <small>
              Progress: {answeredCount}/{quiz.length} ({progress}%)
            </small>
          </section>

          {mode === 'single' ? (
            <>
              <QuizQuestion
                item={quiz[current]}
                index={current}
                total={quiz.length}
                selected={answers[quiz[current].id]}
                explanation={explanations[quiz[current].id]}
                onSelect={(choice) => recordAnswer(quiz[current], choice)}
                lockAfterAnswer={lockAfterAnswer}
              />
              <section className="card nav-row">
                <button onClick={() => setCurrent((v) => Math.max(0, v - 1))} disabled={current === 0}>
                  Prev
                </button>
                <button
                  onClick={() => setCurrent((v) => Math.min(quiz.length - 1, v + 1))}
                  disabled={current === quiz.length - 1}
                >
                  Next
                </button>
              </section>
            </>
          ) : (
            <section>
              {quiz.map((item, index) => (
                <QuizQuestion
                  key={item.id}
                  item={item}
                  index={index}
                  total={quiz.length}
                  selected={answers[item.id]}
                  explanation={explanations[item.id]}
                  onSelect={(choice) => recordAnswer(item, choice)}
                  lockAfterAnswer={lockAfterAnswer}
                />
              ))}
            </section>
          )}

          {debugMode && <DebugPanel questions={quiz} warnings={parsed.warnings} />}

          <section className="card">
            <button onClick={resetAll}>Upload another PDF</button>
          </section>
        </>
      )}

      {showResults && (
        <ResultsView
          questions={quiz}
          answers={answers}
          explanations={explanations}
          onRestart={resetAll}
        />
      )}
    </main>
  );
}

export default App;
