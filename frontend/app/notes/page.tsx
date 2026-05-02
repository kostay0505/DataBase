import Link from 'next/link';
import { getNotes } from '@/lib/trilium';

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? '';
  let notes = [];
  let error = '';

  try {
    notes = await getNotes(query);
  } catch {
    error = 'Не удалось подключиться к Trilium. Убедитесь, что Docker запущен.';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Заметки</h1>
        <Link
          href="/notes/new"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Новая заметка
        </Link>
      </div>

      <form method="GET">
        <input
          name="q"
          defaultValue={query}
          placeholder="Поиск заметок..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </form>

      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {notes.length === 0 && !error && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <div>Заметок нет{query ? ` по запросу «${query}»` : ''}</div>
        </div>
      )}

      <div className="space-y-2">
        {notes.map((note: any) => (
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
