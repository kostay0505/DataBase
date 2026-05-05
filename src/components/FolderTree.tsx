'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Folder, FolderOpen, Plus, ChevronRight, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderItem {
  id: string
  name: string
  parentId: string | null
  children?: FolderItem[]
}

function buildTree(flat: FolderItem[]): FolderItem[] {
  const map = new Map(flat.map(f => [f.id, { ...f, children: [] as FolderItem[] }]))
  const roots: FolderItem[] = []
  for (const item of Array.from(map.values())) {
    if (item.parentId) {
      map.get(item.parentId)?.children?.push(item)
    } else {
      roots.push(item)
    }
  }
  return roots
}

function FolderNode({ folder, activeId }: { folder: FolderItem; activeId: string | null }) {
  const [open, setOpen] = useState(false)
  const hasChildren = (folder.children?.length ?? 0) > 0
  const isActive = activeId === folder.id

  return (
    <div>
      <div className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer group transition-colors',
        isActive ? 'bg-violet-600/15 text-violet-400' : 'text-gray-500 hover:text-gray-300 hover:bg-[#21262d]'
      )}>
        {hasChildren && (
          <button onClick={() => setOpen(v => !v)} className="shrink-0">
            <ChevronRight size={12} className={cn('transition-transform', open && 'rotate-90')} />
          </button>
        )}
        {!hasChildren && <span className="w-3" />}
        <Link href={`/notes?folder=${folder.id}`} className="flex items-center gap-1.5 flex-1 min-w-0">
          {open ? <FolderOpen size={13} /> : <Folder size={13} />}
          <span className="truncate">{folder.name}</span>
        </Link>
      </div>
      {open && hasChildren && (
        <div className="ml-4 border-l border-[#30363d] pl-2">
          {folder.children?.map(child => (
            <FolderNode key={child.id} folder={child} activeId={activeId} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FolderTree() {
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const searchParams = useSearchParams()
  const activeId = searchParams.get('folder')

  async function loadFolders() {
    const res = await fetch('/api/folders')
    const data = await res.json()
    setFolders(data)
  }

  useEffect(() => { loadFolders() }, [])

  async function createFolder() {
    if (!newName.trim()) return setCreating(false)
    await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName('')
    setCreating(false)
    loadFolders()
  }

  const tree = buildTree(folders)

  return (
    <div className="px-2">
      <div className="flex items-center justify-between px-3 py-1 mb-1">
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Папки</span>
        <button
          onClick={() => setCreating(true)}
          className="text-gray-600 hover:text-gray-400 transition-colors"
          title="Новая папка"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* All notes */}
      <Link
        href="/notes"
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
          !activeId ? 'bg-violet-600/15 text-violet-400' : 'text-gray-500 hover:text-gray-300 hover:bg-[#21262d]'
        )}
      >
        <Inbox size={13} />
        Все заметки
      </Link>

      {tree.map(folder => (
        <FolderNode key={folder.id} folder={folder} activeId={activeId} />
      ))}

      {creating && (
        <div className="px-3 py-1">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onBlur={createFolder}
            onKeyDown={e => {
              if (e.key === 'Enter') createFolder()
              if (e.key === 'Escape') { setCreating(false); setNewName('') }
            }}
            placeholder="Название папки..."
            className="w-full bg-[#0d1117] border border-violet-600/50 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}
