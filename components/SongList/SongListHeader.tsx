"use client";

import { Search, X } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { TabType } from './types';

interface SongListHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function SongListHeader({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm 
}: SongListHeaderProps) {
  return (
    <div className="p-4 border-b sticky top-0 bg-background z-10">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-accent'
          }`}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'favorites'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-accent'
          }`}
        >
          Ulubione
        </button>
        <ThemeToggle />
      </div>
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
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-accent"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}