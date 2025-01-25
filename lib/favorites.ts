// Favorites management
const FAVORITES_KEY = 'songbook-favorites';

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function toggleFavorite(songId: number): boolean {
  const favorites = getFavorites();
  const isCurrentlyFavorite = favorites.includes(songId);
  
  const newFavorites = isCurrentlyFavorite
    ? favorites.filter(id => id !== songId)
    : [...favorites, songId];
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  return !isCurrentlyFavorite;
}

export function isFavorite(songId: number): boolean {
  return getFavorites().includes(songId);
}