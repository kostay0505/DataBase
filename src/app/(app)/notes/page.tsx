import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Plus, FileText, Search } from 'lucide-react'
import SearchBar from '@/components/SearchBar'

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { folder?: string; tag?: string; q?: string }
}) {
  const { folder, tag, q } = searchParams

  const notes = await db.note.findMany({
    where: {
      ...(folder === 'null' ? { folderId: null } : folder ? { folderId: folder } : {}),
      ...(tag ? { tags: { some: { tagId: tag } } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      tags: { include: { tag: true } },
      folder: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const activeFolder = folder ? await db.folder.findUnique({ where: { id: folder } }) : null

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            {activeFolder ? `📁 ${activeFolder.name}` : 'Все заметки'}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">{notes.length} заметок</p>
        </div>
        <Link
          href="/notes/new"
          className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Новая заметка
        </Link>
      </div>

      <SearchBar />

      {notes.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p>Заметок нет</p>
        </div>
      ) : (
        <div className="grid gap-3 mt-4">
          {notes.map(note => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="block bg-[#161b22] border border-[#30363d] hover:border-violet-600/50 rounded-xl p-4 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-200 group-hover:text-white truncate">
                    {note.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {note.content.replace(/<[^>]+>/g, '').slice(0, 100)}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {note.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: tag.color + '25', color: tag.color }}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: ru })}
                  </span>
                  {note.folder && (
                    <div className="text-xs text-gray-600 mt-1">📁 {note.folder.name}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
