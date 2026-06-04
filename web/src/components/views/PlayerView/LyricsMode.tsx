import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useLyrics } from '../../../hooks/useLyrics';
import type { Song } from '../../../types/song';

export const LyricsMode: React.FC<{
  track: Song;
  onClose: () => void;
  currentTime: number;
}> = ({ track, onClose, currentTime }) => {
  const { lyrics, isLoading, error } = useLyrics(track.title, track.artist);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const scrollPosition = lyrics ? lyrics.findIndex((line, i) => {
    const nextLine = lyrics[i + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  }) : -1;

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [scrollPosition]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col z-20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[60px] z-0" />

      {/* Header */}
      <div className="relative z-10 w-full p-8 flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors cursor-pointer"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
        <div className="text-center flex-1 pr-12">
          <h2 className="text-xl font-bold text-white tracking-wide">{track.title}</h2>
          <p className="text-sm font-medium text-white/50">{track.artist}</p>
        </div>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={containerRef}
        className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-8 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden mask-image-fade py-[40vh]"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 gap-4 mt-[-20vh]">
            <RefreshCw className="w-8 h-8 animate-spin text-white/20" />
            <p>Searching for lyrics...</p>
          </div>
        ) : error || !lyrics || lyrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 mt-[-20vh]">
            <p>{error || "No synchronized lyrics available for this track."}</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            {lyrics.map((line, idx) => {
              const isActive = idx === scrollPosition;
              const isPast = idx < scrollPosition;
              
              return (
                <motion.div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  className={cn(
                    "w-full text-center py-2 transition-all duration-700 ease-out",
                    isActive 
                      ? "opacity-100 scale-100" 
                      : isPast 
                        ? "opacity-20 scale-[0.9]"
                        : "opacity-40 scale-[0.9]"
                  )}
                >
                  <p 
                    className={cn(
                      "font-bold transition-all duration-700 leading-tight",
                      isActive 
                        ? "text-white text-3xl md:text-4xl lg:text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                        : "text-white/70 text-2xl md:text-3xl lg:text-4xl"
                    )}
                  >
                    {line.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
