import { NextResponse } from 'next/server';
import { getSongs } from '@/lib/songs';

export async function GET() {
  const songs = getSongs();
  return NextResponse.json(songs);
}