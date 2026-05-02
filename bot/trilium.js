const BASE = process.env.TRILIUM_URL;
const TOKEN = process.env.TRILIUM_TOKEN;

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function createNote(title, content) {
  const res = await fetch(`${BASE}/etapi/create-note`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ parentNoteId: 'root', title, content, type: 'text' }),
  });
  if (!res.ok) throw new Error(`Trilium error: ${res.status}`);
  return res.json();
}

async function searchNotes(query) {
  const res = await fetch(
    `${BASE}/etapi/notes?search=${encodeURIComponent(query)}`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`Trilium error: ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}

async function getTodayNotes() {
  const today = new Date().toISOString().slice(0, 10);
  return searchNotes(today);
}

module.exports = { createNote, searchNotes, getTodayNotes };
