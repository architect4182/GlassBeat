import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../types/song';
import { songs } from '../data/songs';

// Re-export Song as Track alias so existing consumers keep working
export type { Song };
export { songs };

type PlayerContextType = {
  currentSong: Song;
  isPlaying: boolean;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying(prev => !prev);

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, setCurrentSong, togglePlay }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
