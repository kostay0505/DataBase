'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Box, CheckSquare, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import FolderTree from './FolderTree'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/notes', label: 'Заметки', icon: FileText },
  { href: '/blender', label: 'Blender.Knows', icon: Box, soon: true },
  { href: '/plans', label: 'Планы', icon: CheckSquare, soon: true },
]

export default function Sidebar() {
  const pathname = usePathname()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <aside className="w-60 shrink-0 bg-[#161b22] border-r border-[#30363d] flex flex-col h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#30363d]">
        <div className="text-base font-bold text-violet-400 tracking-tight">Pigulevsky DB</div>
        <div className="text-xs text-gray-600 mt-0.5">База знаний</div>
      </div>

      {/* Nav */}
      <nav className="p-2 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, soon }) => (
          <Link
            key={href}
            href={soon ? '#' : href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              soon && 'pointer-events-none text-gray-700',
              !soon && (pathname === href || (href !== '/' && pathname.startsWith(href)))
                ? 'bg-violet-600/15 text-violet-400'
                : !soon && 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]'
            )}
          >
            <Icon size={15} />
            <span className="flex-1">{label}</span>
            {soon && (
              <span className="text-[10px] bg-[#21262d] text-gray-600 px-1.5 py-0.5 rounded">soon</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Folder tree (notes section) */}
      {(pathname === '/notes' || pathname.startsWith('/notes')) && (
        <div className="flex-1 overflow-y-auto border-t border-[#30363d] mt-2 pt-2">
          <Suspense fallback={null}><FolderTree /></Suspense>
        </div>
      )}

      <div className="p-2 border-t border-[#30363d] mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-300 hover:bg-[#21262d] w-full transition-colors"
        >
          <LogOut size={15} />
          Выйти
        </button>
      </div>
    </aside>
  )
}
