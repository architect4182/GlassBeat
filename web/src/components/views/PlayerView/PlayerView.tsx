import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mic2, ListMusic } from 'lucide-react';
import { LyricsMode } from './LyricsMode';
import { CenterPanel } from './CenterPanel';
import { QueuePanel } from './QueuePanel';
import { ScrubberBar } from './ScrubberBar';
import { PlaybackControls } from './PlaybackControls';

interface PlayerViewProps {
  audio: any; // Using any for brevity representing useAudioPlayer hook return type
  onClose: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({ audio, onClose }) => {
  const track = audio.currentSong;
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Parse color to rgba for smooth gradients
  const hex2rgb = (hex: string, alpha: number) => {
    if (!hex.startsWith('#')) return `rgba(34, 211, 238, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const primaryGlow = hex2rgb(track.theme.primary, 0.4);
  const secondaryGlow = hex2rgb(track.theme.glow, 0.3);

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden text-white flex items-center justify-center bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 1. Dark Base Layer */}
      <div className="absolute inset-0 bg-slate-950 z-0" />

      {/* 2. Dynamic Ambient Glow (Breathing Animation) */}
      <motion.div
        className="absolute inset-0 z-0 opacity-80 mix-blend-screen"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${primaryGlow} 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${secondaryGlow} 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 30%, ${primaryGlow} 0%, transparent 70%), radial-gradient(circle at 30% 70%, ${secondaryGlow} 0%, transparent 70%)`,
            `radial-gradient(circle at 30% 30%, ${primaryGlow} 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${secondaryGlow} 0%, transparent 60%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* 3. Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Top-Left: Close Button (Hidden when lyrics are open) */}
      <AnimatePresence>
        {!isLyricsOpen && (
          <motion.button
            key="close-player"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, y: 2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-10 left-10 z-30 w-14 h-14 rounded-full backdrop-blur-3xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.1] shadow-lg transition-all cursor-pointer"
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex flex-col pt-8 pb-10 px-6">
        
        {/* Dynamic Center Area (CenterPanel OR LyricsMode) */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
          <AnimatePresence mode="wait">
            {isLyricsOpen ? (
              <LyricsMode 
                key="lyrics"
                track={track}
                currentTime={audio.currentTime}
                onClose={() => setIsLyricsOpen(false)}
              />
            ) : (
              <CenterPanel
                key="center"
                track={track}
                isPlaying={audio.isPlaying}
                analyserNode={audio.analyserNode}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Shared Bottom Playback Controls */}
        <div className="w-full max-w-2xl mx-auto shrink-0 flex flex-col pt-8 mt-auto z-30 relative">
          <ScrubberBar 
            currentTime={audio.currentTime} 
            duration={audio.duration} 
            onSeek={audio.seek} 
            primaryColor={track.theme.primary} 
          />
          <div className="mt-4">
            <PlaybackControls 
              isPlaying={audio.isPlaying}
              onTogglePlay={audio.togglePlay}
              onNext={audio.nextSong}
              onPrev={audio.prevSong}
              primaryColor={track.theme.primary}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isLyricsOpen && (
          <div className="absolute bottom-12 left-12 z-30 hidden md:block">
            <motion.button
              onClick={() => setIsLyricsOpen(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl backdrop-blur-3xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.1] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-colors group"
            >
              <Mic2 className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLyricsOpen && (
          <div className="absolute bottom-12 right-12 z-30 hidden md:block">
            <motion.button
              onClick={() => setIsQueueOpen(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl backdrop-blur-3xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.1] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-colors group"
            >
              <ListMusic className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Action Buttons (Centered at bottom, hidden when lyrics open) */}
      <AnimatePresence>
        {!isLyricsOpen && (
          <motion.div 
            className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-6 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.button
              onClick={() => setIsLyricsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full backdrop-blur-3xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center"
            >
              <Mic2 className="w-5 h-5 text-white/80" />
            </motion.button>
            <motion.button
              onClick={() => setIsQueueOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full backdrop-blur-3xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center"
            >
              <ListMusic className="w-5 h-5 text-white/80" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isQueueOpen && (
          <QueuePanel 
            currentTrack={track} 
            onClose={() => setIsQueueOpen(false)} 
            onTrackClick={(song) => {
              audio.playSong(song);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
