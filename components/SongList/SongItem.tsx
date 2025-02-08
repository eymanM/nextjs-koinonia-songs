"use client";

import { Music4, Heart, Wind } from 'lucide-react';
import { Song } from '@/lib/types';

interface SongItemProps {
  song: Song;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export function SongItem({
  song,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite
}: SongItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`w-full p-4 hover:bg-accent flex items-center gap-3 cursor-pointer ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      {song.doDucha ? (
        <Wind className="w-5 h-5 text-primary" />
      ) : (
        <Music4 className="w-5 h-5 text-muted-foreground" />
      )}
      <div className="flex-1">
        <div className="font-medium">{song.tytul}</div>
        <div className="text-sm text-muted-foreground">Nr {song.numer}</div>
      </div>
      <div
        onClick={onToggleFavorite}
        className="p-2 rounded-full hover:bg-background"
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite
              ? 'fill-primary text-primary'
              : 'text-muted-foreground'
          }`}
        />
      </div>
    </div>
  );
}