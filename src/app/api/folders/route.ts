import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const folders = await db.folder.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(folders)
}

export async function POST(req: NextRequest) {
  const { name, parentId } = await req.json()
  const folder = await db.folder.create({
    data: { name, parentId: parentId || null },
  })
  return NextResponse.json(folder, { status: 201 })
}
