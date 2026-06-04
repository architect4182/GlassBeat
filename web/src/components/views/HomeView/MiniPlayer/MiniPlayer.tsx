import { useState } from 'react';
import { motion } from 'framer-motion';
import { MiniPlayerAlbumArt } from './MiniPlayerAlbumArt';
import { MiniPlayerTrackInfo } from './MiniPlayerTrackInfo';
import { MiniPlayerControls } from './MiniPlayerControls';
import { MiniPlayerProgressBar } from './MiniPlayerProgressBar';

interface MiniPlayerProps {
  audio: any;
  onExpand: () => void;
  isVisible: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ audio, onExpand, isVisible }) => {
  const [isDragging, setIsDragging] = useState(false);

  const track = audio.currentSong;
  if (!track || !isVisible) return null;

  const progress = audio.duration ? audio.currentTime / audio.duration : 0;
  const albumColor = track.theme.primary; // Extracted directly from our song data theme

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 z-50 pointer-events-auto w-[calc(100%-2rem)] md:w-[460px]"
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ x: "-50%" }}
    >
      {/* Premium Mini-Player Container */}
      <motion.div
        onClick={onExpand}
        whileHover="hover"
        initial="rest"
        animate="rest"
        className="cursor-pointer group relative"
      >
        {/* Glassmorphic Background Layer */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(
              circle at 30% 30%,
              ${albumColor}30 0%,
              ${albumColor}10 60%,
              rgba(255,255,255,0.05) 100%
            )`,
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
          }}
          variants={{
            rest: {
              boxShadow: `0 10px 40px ${albumColor}20, 0 2px 10px ${albumColor}10`,
            },
            hover: {
              boxShadow: `0 15px 50px ${albumColor}35, 0 5px 15px ${albumColor}15`,
            },
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Border Glassmorphism */}
        <div className="absolute inset-0 rounded-3xl border border-white/[0.15] pointer-events-none group-hover:border-white/[0.3] transition-colors duration-300" />
        
        {/* Top inner highlight */}
        <div className="absolute inset-0 rounded-3xl border-t border-white/[0.2] pointer-events-none opacity-50 mix-blend-overlay" />

        {/* Content Container */}
        <div className="relative px-6 py-4 flex items-center gap-5 z-10 w-full">
          {/* Left: Album Artwork */}
          <MiniPlayerAlbumArt
            track={track}
            isPlaying={audio.isPlaying}
          />

          {/* Center: Title & Artist */}
          <MiniPlayerTrackInfo track={track} />

          {/* Right: Controls */}
          <MiniPlayerControls
            isPlaying={audio.isPlaying}
            onPlayPause={audio.togglePlay}
            onNext={audio.nextSong}
            onPrev={audio.prevSong}
            onExpand={onExpand}
          />
        </div>

        {/* Clipping container for progress bar to match glass border radius */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-20">
          <MiniPlayerProgressBar
            progress={progress}
            duration={audio.duration}
            onSeek={audio.seek}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            accentColor={albumColor}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
