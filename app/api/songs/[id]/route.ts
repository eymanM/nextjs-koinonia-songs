import { NextResponse } from 'next/server';
import { getSongTexts, getSongChords } from '@/lib/songs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const songId = parseInt(params.id);

  const texts = getSongTexts(songId);
  const chords = texts.map(text => getSongChords(text.id));

  return NextResponse.json({
    texts,
    chords
  });
}