import songsData from '@/data/spis_20250125220201.json';
import textsData from '@/data/tekst_20250125220201-1737838894711.json';
import chordsData from '@/data/chwyty_20250125220201.json';
import { SongData, SongTexts, SongChords } from './types';

export function getSongs() {
  return (songsData as SongData).spis;
}

export function getSongTexts(songNumber: number) {
  return (textsData as SongTexts).tekst.filter(text => text.numer === songNumber);
}

export function getSongChords(textId: number) {
  return (chordsData as SongChords).chwyty.find(chord => chord.id === textId);
}