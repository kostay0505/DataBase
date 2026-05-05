import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const notes = await db.note.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
      tags: { select: { tag: { select: { name: true, color: true } } } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })

  return NextResponse.json(
    notes.map(n => ({
      ...n,
      excerpt: n.content.replace(/<[^>]+>/g, '').slice(0, 120),
    }))
  )
}
