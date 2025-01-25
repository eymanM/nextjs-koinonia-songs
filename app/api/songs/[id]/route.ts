import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const songId = parseInt(params.id);

  const [textResponse, chordsResponse] = await Promise.all([
    supabase
      .from('tekst')
      .select('*')
      .eq('numer', songId)
      .order('id'),
    supabase
      .from('chwyty')
      .select('*')
      .eq('id', songId)
  ]);

  if (textResponse.error || chordsResponse.error) {
    return NextResponse.json(
      { error: textResponse.error || chordsResponse.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    texts: textResponse.data,
    chords: chordsResponse.data
  });
}