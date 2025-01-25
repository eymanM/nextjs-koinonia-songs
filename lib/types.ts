export interface Song {
  numer: number;
  tytul: string;
  doDucha: boolean;
}

export interface SongText {
  id: number;
  numer: number;
  tekst: string;
  copyr: number | null;
}

export interface SongChord {
  id: number;
  chwyt: string;
}

export interface SongData {
  spis: Song[];
}

export interface SongTexts {
  tekst: SongText[];
}

export interface SongChords {
  chwyty: SongChord[];
}