import Link from 'next/link';
import { getNote, getNoteContent } from '@/lib/trilium';
import NoteEditor from '@/components/NoteEditor';

export default async function NotePage({ params }: { params: { id: string } }) {
  let note = null;
  let content = '';
  let error = '';

  try {
    note = await getNote(params.id);
    try {
      content = await getNoteContent(params.id);
    } catch {
      content = '';
    }
  } catch {
    error = 'Заметка не найдена или Trilium недоступен.';
  }

  if (error) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-4xl mb-3">⚠️</div>
        <div>{error}</div>
        <Link href="/notes" className="text-blue-400 hover:underline mt-4 inline-block">
          ← Назад к заметкам
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Link href="/notes" className="hover:text-gray-300 transition-colors">
          ← Заметки
        </Link>
        <span>/</span>
        <span className="text-gray-300">{note?.title}</span>
      </div>
      <NoteEditor noteId={params.id} initialTitle={note?.title ?? ''} initialContent={content} />
    </div>
  );
}
