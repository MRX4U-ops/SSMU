import { useState } from 'react';
import { parseQuizFromPdf } from '../utils/pdfParser';

function PdfUploader({ onParsed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await parseQuizFromPdf(file);
      if (!result.questions.length) {
        setError('No valid MCQs found. Ensure the format uses {=correct ~wrong ~wrong}.');
      }
      onParsed(result);
    } catch (parseError) {
      setError('Failed to parse PDF. Check format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Upload MCQ PDF</h2>
      <input type="file" accept="application/pdf" onChange={onUpload} />
      {loading && <p>Parsing PDF...</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default PdfUploader;
