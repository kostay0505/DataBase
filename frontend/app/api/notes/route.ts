import { NextRequest, NextResponse } from 'next/server';
import { createNote, getNotes } from '@/lib/trilium';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  try {
    const notes = await getNotes(q);
    return NextResponse.json(notes);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    const note = await createNote(title, content);
    return NextResponse.json(note);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
