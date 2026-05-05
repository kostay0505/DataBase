'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q)
      if (q.trim().length >= 2) {
        router.push(`/notes?q=${encodeURIComponent(q.trim())}`)
      } else if (q === '') {
        router.push('/notes')
      }
    },
    [router]
  )

  return (
    <div className="relative mb-4">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
      <input
        type="text"
        placeholder="Поиск по заметкам..."
        value={query}
        onChange={e => handleSearch(e.target.value)}
        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
      />
    </div>
  )
}
