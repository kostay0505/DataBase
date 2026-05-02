'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  noteId: string;
  initialTitle: string;
  initialContent: string;
}

export default function NoteEditor({ noteId, initialTitle, initialContent }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Удалить эту заметку?')) return;
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      router.push('/notes');
    } catch {
      setError('Не удалось удалить');
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{initialTitle}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={24}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-gray-700 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
