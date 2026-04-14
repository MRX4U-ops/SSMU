import fs from 'fs/promises';
import pdf from 'pdf-parse';

export async function parseUploadedFile(file) {
  const raw = await fs.readFile(file.path);
  let text = '';
  if (file.mimetype.includes('pdf')) {
    const result = await pdf(raw);
    text = result.text;
  } else {
    text = raw.toString('utf8');
  }
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return {
    detected_questions: lines.filter((l) => /^\d+[.)]/.test(l)).slice(0, 100),
    preview: lines.slice(0, 200)
  };
}
