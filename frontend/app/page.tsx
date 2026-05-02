import Link from 'next/link';
import { getNotes } from '@/lib/trilium';

export default async function Home() {
  let recentNotes = [];
  try {
    recentNotes = await getNotes('');
  } catch {
    // Trilium may not be ready yet
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать</h1>
        <p className="text-gray-400">Ваши заметки и напоминания в одном месте.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/notes"
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition-colors"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="font-semibold text-white">Все заметки</div>
          <div className="text-sm text-gray-400 mt-1">Просмотр и поиск</div>
        </Link>
        <Link
          href="/notes/new"
          className="bg-blue-600 hover:bg-blue-500 rounded-xl p-6 transition-colors"
        >
          <div className="text-2xl mb-2">✏️</div>
          <div className="font-semibold text-white">Новая заметка</div>
          <div className="text-sm text-blue-200 mt-1">Создать сейчас</div>
        </Link>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-2xl mb-2">🤖</div>
          <div className="font-semibold text-white">Telegram бот</div>
          <div className="text-sm text-gray-400 mt-1">/note — быстрая заметка</div>
        </div>
      </div>

      {recentNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-3">Последние заметки</h2>
          <div className="space-y-2">
            {recentNotes.slice(0, 5).map((note: any) => (
              <Link
                key={note.noteId}
                href={`/note/${note.noteId}`}
                className="block bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-white">{note.title}</span>
                <span className="text-gray-500 text-sm ml-2">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
