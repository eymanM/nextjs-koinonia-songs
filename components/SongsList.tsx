"use client";

import { useState, useEffect } from 'react';
import { useSong } from './SongContext';
import { Search, Music4, Heart, Library, ArrowLeft, PanelLeftClose, PanelLeft, Wind, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import SongView from './SongView';
import { getSongs, getSongTexts } from '@/lib/songs';
import { Song, SongText } from '@/lib/types';
import { getFavorites, toggleFavorite } from '@/lib/favorites';

interface SongWithTexts extends Song {
  texts: SongText[];
}

type TabType = 'all' | 'favorites';

// Helper function to remove commas and normalize text for searching
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/,/g, '').trim();
}

export default function SongsList() {
  const [songs, setSongs] = useState<SongWithTexts[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const { selectedSong, setSelectedSong } = useSong();
  const [showMobileList, setShowMobileList] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPresentation, setIsPresentation] = useState(false);

  useEffect(() => {
    const allSongs = getSongs();
    const songsWithTexts = allSongs.map(song => ({
      ...song,
      texts: getSongTexts(song.numer)
    }));
    songsWithTexts.sort((a, b) => a.numer - b.numer);
    setSongs(songsWithTexts);
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    setShowMobileList(!selectedSong);
  }, [selectedSong]);

  // Add this new effect to handle scrolling
  useEffect(() => {
    if (selectedSong && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedSong]);

  const handleToggleFavorite = (songId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const isNowFavorite = toggleFavorite(songId);
    setFavorites(getFavorites());
  };

  const filteredSongs = songs.filter(song => {
    const normalizedSearch = normalizeText(searchTerm);

    if (activeTab === 'favorites' && !favorites.includes(song.numer)) {
      return false;
    }

    // If search term is a number, match exactly with song number
    if (/^\d+$/.test(searchTerm)) {
      return song.numer.toString() === searchTerm;
    }

    // Match song number
    if (song.numer.toString().includes(normalizedSearch)) {
      return true;
    }

    // Match title without commas
    if (normalizeText(song.tytul).includes(normalizedSearch)) {
      return true;
    }

    // Match text content without commas
    return song.texts.some(text =>
      normalizeText(text.tekst).includes(normalizedSearch)
    );
  });

  const renderSongItem = (song: SongWithTexts, onClick: () => void) => (
    <div
      key={song.numer}
      onClick={onClick}
      className={`w-full p-4 hover:bg-accent flex items-center gap-3 cursor-pointer ${selectedSong === song.numer ? 'bg-accent' : ''
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
        onClick={(e) => handleToggleFavorite(song.numer, e)}
        className="p-2 rounded-full hover:bg-background"
      >
        <Heart
          className={`w-5 h-5 ${favorites.includes(song.numer)
              ? 'fill-primary text-primary'
              : 'text-muted-foreground'
            }`}
        />
      </div>
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Szukaj po numerze, tytule lub tekście..."
        className="w-full pl-10 pr-10 py-2 border rounded-md bg-background"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setSearchTerm('');
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-accent"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      {/* Sidebar Toggle and Theme Toggle - Desktop Only */}
      {!isPresentation && (
        <div className="hidden lg:flex fixed top-4 left-4 z-20 gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 bg-background border rounded-md hover:bg-accent transition-colors"
          >
            {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
          <ThemeToggle />
        </div>
      )}

      {/* Sidebar - Hidden on mobile and in presentation mode */}
      {!isPresentation && (
        <div
          className={`hidden lg:flex lg:w-80 border-r bg-card flex-shrink-0 flex-col transition-all duration-300 fixed top-0 bottom-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b pt-16 flex-shrink-0">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-accent'
                    }`}
                >
                  <Library className="w-4 h-4 inline-block mr-2" />
                  Wszystkie
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'favorites'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-accent'
                    }`}
                >
                  <Heart className="w-4 h-4 inline-block mr-2" />
                  Ulubione
                </button>
              </div>
              {renderSearchInput()}
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredSongs.map((song) => renderSongItem(song, () => setSelectedSong(song.numer)))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile view - Hidden in presentation mode */}
      {!isPresentation && (
        <div className="lg:hidden flex-1">
          {showMobileList ? (
            <>
              <div className="p-4 border-b sticky top-0 bg-background z-10">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-accent'
                      }`}
                  >
                    <Library className="w-4 h-4 inline-block mr-2" />
                    Wszystkie
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'favorites'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-accent'
                      }`}
                  >
                    <Heart className="w-4 h-4 inline-block mr-2" />
                    Ulubione
                  </button>
                  <ThemeToggle />
                </div>
                {renderSearchInput()}
              </div>
              <div className="divide-y">
                {filteredSongs.map((song) => renderSongItem(song, () => {
                  setSelectedSong(song.numer);
                  setShowMobileList(false);
                }))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${showMobileList ? 'hidden lg:block' : 'block'} ${!isPresentation && showSidebar ? 'lg:ml-80' : ''}`}>
        {selectedSong ? (
          <SongView
            songId={selectedSong}
            onBack={() => {
              setShowMobileList(true);
              setSelectedSong(null);
            }}
            isFavorite={favorites.includes(selectedSong)}
            onToggleFavorite={() => handleToggleFavorite(selectedSong)}
            isPresentation={isPresentation}
            onPresentationChange={setIsPresentation}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
            <div>
              <Music4 className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-medium">Wybierz pieśń</h2>
              <p>Wybierz pieśń z listy aby zobaczyć jej tekst</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}