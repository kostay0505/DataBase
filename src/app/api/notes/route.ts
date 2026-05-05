import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractTags, tagColor } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const folderId = searchParams.get('folderId')
  const tagId = searchParams.get('tagId')

  const notes = await db.note.findMany({
    where: {
      ...(folderId === 'null' ? { folderId: null } : folderId ? { folderId } : {}),
      ...(tagId ? { tags: { some: { tagId } } } : {}),
    },
    include: {
      tags: { include: { tag: true } },
      folder: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const { title, content = '', folderId } = await req.json()

  const tagNames = extractTags(content)

  const note = await db.note.create({
    data: {
      title,
      content,
      folderId: folderId || null,
      tags: tagNames.length
        ? {
            create: await Promise.all(
              tagNames.map(async name => {
                const tag = await db.tag.upsert({
                  where: { name },
                  create: { name, color: tagColor(name) },
                  update: {},
                })
                return { tagId: tag.id }
              })
            ),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  })

  return NextResponse.json(note, { status: 201 })
}
