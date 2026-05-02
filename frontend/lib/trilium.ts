const BASE = process.env.TRILIUM_URL;
const TOKEN = process.env.TRILIUM_TOKEN;

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export interface Note {
  noteId: string;
  title: string;
  type: string;
  dateCreated: string;
  dateModified: string;
}

export interface NoteWithContent extends Note {
  content: string;
}

export async function getNotes(search: string = ''): Promise<Note[]> {
  const res = await fetch(`${BASE}/etapi/notes?search=${encodeURIComponent(search)}`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch notes');
  const data = await res.json();
  return data.results ?? [];
}

export async function getNote(id: string): Promise<Note> {
  const res = await fetch(`${BASE}/etapi/notes/${id}`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch note');
  return res.json();
}

export async function getNoteContent(id: string): Promise<string> {
  const res = await fetch(`${BASE}/etapi/notes/${id}/content`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch note content');
  return res.text();
}

export async function createNote(title: string, content: string): Promise<Note> {
  const res = await fetch(`${BASE}/etapi/create-note`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ parentNoteId: 'root', title, content, type: 'text' }),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

export async function updateNoteContent(id: string, content: string): Promise<void> {
  const res = await fetch(`${BASE}/etapi/notes/${id}/content`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: content,
  });
  if (!res.ok) throw new Error('Failed to update note');
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${BASE}/etapi/notes/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Failed to delete note');
}
