import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
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

export const LyricsPanel: React.FC<{
  track: Song;
  onClose: () => void;
}> = ({ track, onClose }) => {
  const [scrollPosition] = useState(3); // Mock active line

  return (
    <>
      <motion.div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 h-[70vh] z-50 rounded-t-[2.5rem] backdrop-blur-[40px] bg-white/[0.05] border-t border-white/[0.12] p-8 md:p-12 overflow-y-auto flex flex-col shadow-[0_-8px_32px_rgba(0,0,0,0.25)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="flex justify-between items-center mb-10 max-w-3xl mx-auto w-full">
          <h3 className="text-2xl font-bold text-white tracking-wider">Lyrics</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-8 text-center max-w-3xl mx-auto w-full pb-20">
          {mockLyrics.map((line, idx) => (
            <motion.p
              key={idx}
              className={cn(
                "transition-all duration-700 ease-out",
                idx === scrollPosition 
                  ? "text-white text-3xl md:text-5xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105"
                  : Math.abs(idx - scrollPosition) < 2
                    ? "text-white/60 text-2xl md:text-3xl"
                    : "text-white/20 text-xl md:text-2xl blur-[1px]"
              )}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </>
  );
};
