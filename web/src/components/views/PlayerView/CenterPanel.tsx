import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Song } from '../../../types/song';
import { ScrubberBar } from './ScrubberBar';
import { PlaybackControls } from './PlaybackControls';
import { WaveformVisualizer } from './WaveformVisualizer';

interface CenterPanelProps {
  track: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  analyserNode: AnalyserNode | null;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  analyserNode
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-start space-y-4"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Album Artwork Container */}
      <div
        className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: isHovered ? -12 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Inner Album Art */}
            <motion.img
              layoutId={`album-${track.id}`}
              src={track.cover}
              alt={track.title}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.05 : (isPlaying ? 1.02 : 1),
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Reflection Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent pointer-events-none mix-blend-overlay" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Track Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${track.id}`}
          className="text-center space-y-1 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">{track.title}</h1>
          <p className="text-xl text-white/60 font-medium tracking-wide">{track.artist}</p>
        </motion.div>
      </AnimatePresence>

      {/* Waveform Visualizer */}
      <div className="w-full max-w-lg mt-2">
        <WaveformVisualizer 
          analyserNode={analyserNode} 
          isPlaying={isPlaying} 
          accentColor={track.theme.primary} 
        />
      </div>

      {/* Enhanced Scrubber Bar */}
      <div className="w-full max-w-xl mt-4">
        <ScrubberBar 
          currentTime={currentTime} 
          duration={duration} 
          onSeek={onSeek} 
          primaryColor={track.theme.primary} 
        />
      </div>

      {/* Playback Controls */}
      <div className="mt-4">
        <PlaybackControls 
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onNext={onNext}
          onPrev={onPrev}
          primaryColor={track.theme.primary}
        />
      </div>
    </motion.div>
  );
};
