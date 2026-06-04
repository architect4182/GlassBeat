import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { Song } from '../../../types/song';

const mockLyrics = [
  "Walking through the neon rain",
  "Echoes of your name remain",
  "Shadows dancing on the glass",
  "Watching time and moments pass",
  "In the quiet of the night",
  "Searching for a guiding light",
  "City hums a lonely tune",
  "Underneath the crescent moon",
  "Every heartbeat feels so loud",
  "Lost inside this empty crowd",
  "Whispers in the midnight breeze",
  "Bringing memories to their knees",
  "Looking back at where we stood",
  "I'd change the ending if I could"
];

export const LyricsMode: React.FC<{
  track: Song;
  onClose: () => void;
  currentTime: number;
}> = ({ track, onClose, currentTime }) => {
  // Use a simulated scroll position based on time for demo purposes
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Roughly 4 seconds per line for demonstration
    const activeLine = Math.floor(currentTime / 4);
    setScrollPosition(Math.min(activeLine, mockLyrics.length - 1));
  }, [currentTime]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col z-20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background Blur Overlay for Album Art effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[60px] z-0" />

      {/* Header */}
      <div className="relative z-10 w-full p-8 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
        <div className="text-center flex-1 pr-12">
          <h2 className="text-xl font-bold text-white tracking-wide">{track.title}</h2>
          <p className="text-sm font-medium text-white/50">{track.artist}</p>
        </div>
      </div>

      {/* Lyrics Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center overflow-hidden w-full max-w-4xl mx-auto px-8 mask-image-fade">
        <div 
          className="w-full flex flex-col items-center transition-transform duration-1000 ease-out"
          style={{ transform: `translateY(calc(50vh - 200px - ${scrollPosition * 80}px))` }} // 80px approx height per line
        >
          {mockLyrics.map((line, idx) => {
            const isActive = idx === scrollPosition;
            
            return (
              <motion.div
                key={idx}
                className={cn(
                  "w-full text-center py-4 transition-all duration-700 ease-out",
                  isActive 
                    ? "opacity-100 scale-100" 
                    : "opacity-40 scale-[0.85]"
                )}
              >
                <p 
                  className={cn(
                    "font-bold transition-all duration-700",
                    isActive 
                      ? "text-white text-4xl md:text-5xl lg:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                      : "text-white/70 text-2xl md:text-3xl lg:text-4xl"
                  )}
                >
                  {line}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
