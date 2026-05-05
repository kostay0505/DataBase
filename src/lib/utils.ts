import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTags(content: string): string[] {
  const regex = /#([\w\u0400-\u04FF][\w\u0400-\u04FF-]*)/g
  const tags: string[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    tags.push(match[1])
  }
  return [...new Set(tags)]
}

const TAG_COLORS = [
  '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4',
  '#10b981', '#f59e0b', '#ef4444', '#ec4899',
]

export function tagColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}
