"use client";

import { useEffect, useState } from 'react';
import { Heart, ArrowLeft, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { getSongTexts, getSongChords } from '@/lib/songs';
import { SongText, SongChord } from '@/lib/types';

const TEXT_SIZE_KEY = 'songbook-text-size';
const DEFAULT_TEXT_SIZE = 24;
const PRESENTATION_TEXT_SIZE = 44;

interface SongViewProps {
  songId: number;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isPresentation: boolean;
  onPresentationChange: (isPresentation: boolean) => void;
}

export default function SongView({
  songId,
  onBack,
  isFavorite,
  onToggleFavorite,
  isPresentation,
  onPresentationChange
}: SongViewProps) {
  const [songTexts, setSongTexts] = useState<SongText[]>([]);
  const [chordMap, setChordMap] = useState<Record<number, SongChord | undefined>>({});
  const [showChords, setShowChords] = useState(false);
  const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);
  const [showControls, setShowControls] = useState(true);

  // Load saved text size on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSize = localStorage.getItem(TEXT_SIZE_KEY);
      if (savedSize) {
        setTextSize(parseInt(savedSize, 10));
      }
    }
  }, []);

  useEffect(() => {
    const texts = getSongTexts(songId);
    const chords = texts.reduce((acc, text) => {
      acc[text.id] = getSongChords(text.id);
      return acc;
    }, {} as Record<number, SongChord | undefined>);

    setSongTexts(texts);
    setChordMap(chords);

    if (songId && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [songId]);

  const togglePresentation = () => {
    const newPresentationState = !isPresentation;
    if (newPresentationState) {
      setTextSize(PRESENTATION_TEXT_SIZE);
    } else {
      // Restore the previous non-presentation size from cache
      const savedSize = localStorage.getItem(TEXT_SIZE_KEY);
      setTextSize(savedSize ? parseInt(savedSize, 22) : DEFAULT_TEXT_SIZE);
    }
    onPresentationChange(newPresentationState);
  };

  const increaseSize = () => {
    const newSize = Math.min(textSize + 2, 50);
    setTextSize(newSize);
    if (!isPresentation) {
      localStorage.setItem(TEXT_SIZE_KEY, newSize.toString());
    }
  };

  const decreaseSize = () => {
    const newSize = Math.max(textSize - 2, 24);
    setTextSize(newSize);
    if (!isPresentation) {
      localStorage.setItem(TEXT_SIZE_KEY, newSize.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Controls */}
      <div
        className={`
          ${isPresentation
            ? 'fixed top-4 right-4 opacity-0 transition-opacity duration-200 bg-background/80 backdrop-blur-sm rounded-lg p-2'
            : 'sticky top-0 z-50 bg-background border-b px-4 py-2'
          } 
          ${(showControls || !isPresentation) ? 'opacity-100' : 'opacity-0'} 
          flex items-center gap-2
        `}
      >
        {isPresentation ? (
          <>
            <button
              onClick={togglePresentation}
              className="p-2 hover:bg-accent rounded-full"
              aria-label="Wyjdź z trybu prezentacji"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onBack}
              className="lg:hidden p-2 hover:bg-accent rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowChords(!showChords)}
              className="text-sm bg-secondary px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
            >
              {showChords ? 'Ukryj chwyty' : 'Pokaż chwyty'}
            </button>
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={decreaseSize}
                className="p-2 hover:bg-accent rounded-full"
                aria-label="Zmniejsz tekst"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={increaseSize}
                className="p-2 hover:bg-accent rounded-full"
                aria-label="Powiększ tekst"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={togglePresentation}
              className="p-2 hover:bg-accent rounded-full hidden lg:block"
              aria-label="Tryb prezentacji"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleFavorite}
              className="p-2 rounded-full hover:bg-accent transition-colors ml-auto"
            >
              <Heart
                className={`w-6 h-6 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                  }`}
              />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className={`
        flex-1 
        ${isPresentation ? 'px-16 py-16' : 'px-4 pb-1 pt-3 lg:px-6 lg:py-4'}
      `}>
        <div className={`${isPresentation ? 'w-full max-w-4xl mx-auto' : ''}`}>
          {songTexts
            .filter(text => !isPresentation || text.copyr !== 1)
            .map((text) => (
              <div
                key={text.id}
                className={`
                ${text.tekst ? 'mb-4' : 'mb-6'}
              `}
              >
                {showChords && chordMap[text.id] && (
                  <div
                    className="font-mono mb-1 text-muted-foreground"
                    style={{ fontSize: Math.max(textSize * 0.75, 16) + 'px' }}
                  >
                    {chordMap[text.id]?.chwyt}
                  </div>
                )}
                {text.tekst && (
                  <p
                    className={`
                    ${text.copyr === 1 && !isPresentation ? 'text-muted-foreground italic' : ''}
                    leading-relaxed
                  `}
                    style={{
                      fontSize: text.copyr === 1 && !isPresentation ? Math.max(textSize * 0.75, 16) + 'px' : textSize + 'px'
                    }}
                  >
                    {text.tekst}
                  </p>
                )}
                {!text.tekst && (
                  <div className={`${isPresentation ? 'h-8' : 'h-4'}`} />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}