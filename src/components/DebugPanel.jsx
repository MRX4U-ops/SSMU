import { useMemo, useState } from 'react';

function DebugPanel({ questions, warnings }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  const filtered = useMemo(
    () => questions.filter((q) => q.question.toLowerCase().includes(query.toLowerCase())),
    [questions, query]
  );

  const toggle = (id) => {
    const clone = new Set(expanded);
    if (clone.has(id)) clone.delete(id);
    else clone.add(id);
    setExpanded(clone);
  };

  return (
    <section className="card">
      <h2>Admin / Debug Mode</h2>
      <input
        className="search"
        placeholder="Search question text..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {!!warnings.length && (
        <div className="warning-box">
          <strong>Parsing Warnings:</strong>
          <ul>
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      {filtered.map((q, idx) => (
        <div key={q.id} className="debug-item">
          <button type="button" onClick={() => toggle(q.id)} className="expand-btn">
            {expanded.has(q.id) ? '−' : '+'} #{idx + 1} {q.question}
          </button>
          {expanded.has(q.id) && (
            <ul>
              {q.options.map((opt) => (
                <li key={opt}>
                  {opt} {opt === q.correctAnswer ? '✅ (Correct)' : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

export default DebugPanel;
