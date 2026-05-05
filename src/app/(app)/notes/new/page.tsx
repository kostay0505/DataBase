'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NoteEditor from '@/components/NoteEditor'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function NewNoteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folder')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, folderId }),
      })
      if (res.ok) {
        const note = await res.json()
        router.push(`/notes/${note.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/notes" className="text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-gray-600 text-sm">Новая заметка</span>
      </div>

      <input
        type="text"
        placeholder="Заголовок..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-transparent text-2xl font-bold text-white placeholder-gray-700 focus:outline-none mb-4"
        autoFocus
      />

      <NoteEditor content={content} onChange={setContent} />

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#30363d]">
        <button
          onClick={handleSave}
          disabled={!title.trim() || saving}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <Link href="/notes" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          Отмена
        </Link>
      </div>
    </div>
  )
}

export default function NewNotePage() {
  return <Suspense><NewNoteContent /></Suspense>
}
