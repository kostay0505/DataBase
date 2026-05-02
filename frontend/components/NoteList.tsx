'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Note {
  noteId: string;
  title: string;
  dateModified: string;
}

interface Props {
  notes: Note[];
}

export default function NoteList({ notes }: Props) {
  const [query, setQuery] = useState('');
  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Фильтр..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500">Ничего не найдено</div>
      )}
      <div className="space-y-2">
        {filtered.map((note) => (
          <Link
            key={note.noteId}
            href={`/note/${note.noteId}`}
            className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors group"
          >
            <span className="text-white">{note.title}</span>
            <span className="text-gray-600 group-hover:text-gray-400 text-sm">
              {new Date(note.dateModified).toLocaleDateString('ru-RU')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
