'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NoteEditor from '@/components/NoteEditor'
import { ArrowLeft, Trash2, Save, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Tag { id: string; name: string; color: string }
interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  tags: Array<{ tag: Tag }>
  backlinks: Array<{ source: { id: string; title: string } }>
}

export default function NotePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then(r => r.json())
      .then(n => {
        setNote(n)
        setTitle(n.title)
        setContent(n.content)
        setLoading(false)
      })
  }, [id])

  const handleSave = useCallback(async () => {
    if (!title.trim() || saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      if (res.ok) {
        const updated = await res.json()
        setNote(prev => prev ? { ...prev, ...updated } : updated)
        setDirty(false)
      }
    } finally {
      setSaving(false)
    }
  }, [id, title, content, saving])

  // Ctrl+S to save
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleSave])

  async function handleDelete() {
    if (!confirm('Удалить заметку?')) return
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    router.push('/notes')
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-800 rounded w-full mb-2" />
        <div className="h-4 bg-gray-800 rounded w-4/5" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Заметка не найдена</p>
        <Link href="/notes" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">← Назад</Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/notes" className="text-gray-500 hover:text-gray-300 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          {note.updatedAt && (
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Clock size={12} />
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: ru })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <Save size={13} />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => { setTitle(e.target.value); setDirty(true) }}
        className="w-full bg-transparent text-2xl font-bold text-white placeholder-gray-700 focus:outline-none mb-4"
        placeholder="Заголовок..."
      />

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: tag.color + '25', color: tag.color }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Editor */}
      <NoteEditor
        content={content}
        onChange={c => { setContent(c); setDirty(true) }}
      />

      {/* Backlinks */}
      {note.backlinks.length > 0 && (
        <div className="mt-8 pt-4 border-t border-[#30363d]">
          <h3 className="text-xs text-gray-600 uppercase tracking-wider mb-2">Обратные ссылки</h3>
          <div className="flex flex-wrap gap-2">
            {note.backlinks.map(({ source }) => (
              <Link
                key={source.id}
                href={`/notes/${source.id}`}
                className="text-sm text-violet-400 hover:text-violet-300 bg-violet-600/10 border border-violet-600/20 px-2 py-1 rounded-lg transition-colors"
              >
                {source.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
