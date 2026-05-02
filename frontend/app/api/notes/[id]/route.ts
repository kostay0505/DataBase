import { NextRequest, NextResponse } from 'next/server';
import { updateNoteContent, deleteNote } from '@/lib/trilium';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { content } = await req.json();
    await updateNoteContent(params.id, content);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteNote(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
