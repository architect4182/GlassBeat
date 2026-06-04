import { motion } from 'framer-motion';
import { Play, Pause, ChevronUp, SkipBack, SkipForward } from 'lucide-react';

interface MiniPlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExpand: () => void;
}

export const MiniPlayerControls: React.FC<MiniPlayerControlsProps> = ({ isPlaying, onPlayPause, onNext, onPrev, onExpand }) => {
  return (
    <div className="flex items-center gap-1.5 md:gap-3">
      {/* Previous Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer hidden md:flex"
      >
        <SkipBack className="w-4 h-4" fill="currentColor" />
      </motion.button>

      {/* Play/Pause Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onPlayPause();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white hover:bg-white/[0.12] hover:border-white/[0.2] shadow-lg transition-all cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" fill="currentColor" />
        ) : (
          <Play className="w-5 h-5 ml-1" fill="currentColor" />
        )}
      </motion.button>

      {/* Next Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        <SkipForward className="w-4 h-4" fill="currentColor" />
      </motion.button>

      {/* Expand Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
};
