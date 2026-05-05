import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractTags, tagColor } from '@/lib/utils'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const note = await db.note.findUnique({
    where: { id: params.id },
    include: {
      tags: { include: { tag: true } },
      folder: { select: { id: true, name: true } },
      backlinks: {
        include: { source: { select: { id: true, title: true } } },
      },
    },
  })
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(note)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, content, folderId } = await req.json()

  const existing = await db.note.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Save version snapshot
  await db.noteVersion.create({
    data: { noteId: params.id, title: existing.title, content: existing.content },
  })

  // Sync tags
  const tagNames = extractTags(content)
  await db.noteTag.deleteMany({ where: { noteId: params.id } })

  const note = await db.note.update({
    where: { id: params.id },
    data: {
      title,
      content,
      folderId: folderId ?? existing.folderId,
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

  return NextResponse.json(note)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await db.note.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
