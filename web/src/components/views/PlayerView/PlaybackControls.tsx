import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  primaryColor: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ isPlaying, onTogglePlay, onNext, onPrev, primaryColor }) => {
  return (
    <motion.div
      className="flex items-center justify-center gap-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <button className="text-white/40 hover:text-white transition-colors cursor-pointer">
        <Shuffle size={20} />
      </button>

      {/* Previous Button */}
      <motion.button
        onClick={onPrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full backdrop-blur-md bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white hover:bg-white/[0.12] hover:border-white/[0.2] shadow-lg transition-all cursor-pointer"
      >
        <SkipBack className="w-6 h-6" fill="currentColor" />
      </motion.button>

      {/* Play/Pause Button - Large & Prominent */}
      <motion.button
        onClick={onTogglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isPlaying
            ? `0 0 40px ${primaryColor}60`
            : `0 0 20px ${primaryColor}30`,
        }}
        className="w-20 h-20 rounded-full backdrop-blur-md border border-white/40 flex items-center justify-center text-white font-bold shadow-xl cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`
        }}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" fill="currentColor" />
        ) : (
          <Play className="w-8 h-8 ml-1" fill="currentColor" />
        )}
      </motion.button>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full backdrop-blur-md bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white hover:bg-white/[0.12] hover:border-white/[0.2] shadow-lg transition-all cursor-pointer"
      >
        <SkipForward className="w-6 h-6" fill="currentColor" />
      </motion.button>

      <button className="text-white/40 hover:text-white transition-colors cursor-pointer">
        <Repeat size={20} />
      </button>
    </motion.div>
  );
};
