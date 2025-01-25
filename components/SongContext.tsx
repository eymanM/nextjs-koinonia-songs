"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SongContextType {
  selectedSong: number | null;
  setSelectedSong: (id: number | null) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export function SongProvider({ children }: { children: ReactNode }) {
  const [selectedSong, setSelectedSong] = useState<number | null>(null);

  return (
    <SongContext.Provider value={{ selectedSong, setSelectedSong }}>
      {children}
    </SongContext.Provider>
  );
}

export function useSong() {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
}