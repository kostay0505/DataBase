import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const folder = await db.folder.update({ where: { id: params.id }, data })
  return NextResponse.json(folder)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await db.folder.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
