import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mic2, ListMusic } from 'lucide-react';
import { LyricsMode } from './LyricsMode';
import { CenterPanel } from './CenterPanel';
import { QueuePanel } from './QueuePanel';
import { ScrubberBar } from './ScrubberBar';
import { PlaybackControls } from './PlaybackControls';

interface PlayerViewProps {
  audio: any;
  onClose: () => void;
}

const hex2rgba = (hex: string, a: number) => {
  if (!hex.startsWith('#')) return `rgba(80,80,180,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const PlayerView: React.FC<PlayerViewProps> = ({ audio, onClose }) => {
  const track = audio.currentSong;
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const p1 = hex2rgba(track.theme.primary, 0.35);
  const p2 = hex2rgba(track.theme.glow, 0.22);

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* ── Base dark layer ── */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* ── Blurred album cover backdrop ── */}
      <AnimatePresence>
        <motion.div
          key={`bg-${track.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            backgroundImage: `url(${track.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(80px) saturate(1.8)',
            transform: 'scale(1.2)',
            opacity: 0.8,
          }}
        />
      </AnimatePresence>
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* ── Animated ambient orbs ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        key={track.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 700,
            height: 700,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${p1} 0%, ${p2} 40%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary orb offset */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            top: '25%',
            right: '10%',
            background: `radial-gradient(circle, ${hex2rgba(track.theme.primary, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </motion.div>

      {/* ── Noise grain overlay ── */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.025] mix-blend-overlay">
        <svg width="100%" height="100%"><filter id="pgrain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#pgrain)"/></svg>
      </div>

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 pt-8">
        <AnimatePresence>
          {!isLyricsOpen && (
            <motion.button
              key="close"
              onClick={onClose}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
            >
              <ChevronDown className="w-6 h-6 text-white/80" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mini track info in header */}
        <AnimatePresence>
          {!isLyricsOpen && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">Now Playing</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer to balance close button */}
        <div className="w-12" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isLyricsOpen ? (
            <LyricsMode
              key="lyrics"
              track={track}
              currentTime={audio.currentTime}
              onClose={() => setIsLyricsOpen(false)}
            />
          ) : (
            <motion.div
              key="player"
              className="w-full h-full flex flex-col items-center justify-center px-6 pt-20 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Center Stage: Album art + info */}
              <div className="flex-1 flex items-center justify-center min-h-0 w-full">
                <CenterPanel
                  track={track}
                  isPlaying={audio.isPlaying}
                  analyserNode={audio.analyserNode}
                />
              </div>

              {/* Controls floating */}
              <motion.div
                className="w-full max-w-md shrink-0 flex flex-col gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScrubberBar
                  currentTime={audio.currentTime}
                  duration={audio.duration}
                  onSeek={audio.seek}
                  primaryColor={track.theme.primary}
                />
                <PlaybackControls
                  isPlaying={audio.isPlaying}
                  onTogglePlay={audio.togglePlay}
                  onNext={audio.nextSong}
                  onPrev={audio.prevSong}
                  primaryColor={track.theme.primary}
                />
                
                {/* Mobile Action Buttons (in flow) */}
                <div className="flex justify-center gap-6 md:hidden mt-2">
                  <motion.button
                    onClick={() => setIsLyricsOpen(true)}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <Mic2 className="w-5 h-5 text-white/70" />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsQueueOpen(true)}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <ListMusic className="w-5 h-5 text-white/70" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Side action buttons ── */}
      <AnimatePresence>
        {!isLyricsOpen && (
          <>
            {/* Lyrics button — bottom left */}
            <motion.div
              className="absolute bottom-10 left-10 z-30 hidden md:block"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={() => setIsLyricsOpen(true)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                className="group flex items-center gap-2.5 px-4 h-11 rounded-2xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
              >
                <Mic2 className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors tracking-wide">Lyrics</span>
              </motion.button>
            </motion.div>

            {/* Queue button — bottom right */}
            <motion.div
              className="absolute bottom-10 right-10 z-30 hidden md:block"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={() => setIsQueueOpen(true)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                className="group flex items-center gap-2.5 px-4 h-11 rounded-2xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
              >
                <ListMusic className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors tracking-wide">Queue</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Queue Panel ── */}
      <AnimatePresence>
        {isQueueOpen && (
          <QueuePanel
            currentTrack={track}
            playlist={audio.playlist}
            currentIndex={audio.currentIndex}
            onClose={() => setIsQueueOpen(false)}
            onTrackClick={(song) => audio.playSong(song)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
