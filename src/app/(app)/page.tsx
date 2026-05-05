import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { FileText, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const [recentNotes, totalNotes, totalTags, totalFolders] = await Promise.all([
    db.note.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { tags: { include: { tag: true } } },
    }),
    db.note.count(),
    db.tag.count(),
    db.folder.count(),
  ])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Pigulevsky DataBase</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Заметок', value: totalNotes },
          { label: 'Тегов', value: totalTags },
          { label: 'Папок', value: totalFolders },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-2xl font-bold text-violet-400">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent notes */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
          <h2 className="font-semibold text-gray-200 flex items-center gap-2">
            <FileText size={16} className="text-violet-400" />
            Последние заметки
          </h2>
          <Link
            href="/notes/new"
            className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Новая
          </Link>
        </div>

        {recentNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p>Заметок пока нет</p>
            <Link href="/notes/new" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
              Создать первую заметку →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#30363d]">
            {recentNotes.map(note => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex items-center justify-between p-4 hover:bg-[#21262d] transition-colors group"
              >
                <div>
                  <div className="text-gray-200 group-hover:text-white font-medium text-sm">{note.title}</div>
                  <div className="flex gap-1.5 mt-1">
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
                </div>
                <span className="text-xs text-gray-600">
                  {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: ru })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
