import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  primaryColor: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying, onTogglePlay, onNext, onPrev, primaryColor
}) => {
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<0 | 1 | 2>(0); // 0=off, 1=all, 2=one
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [volHovered, setVolHovered] = useState(false);

  const cycleRepeat = () => setRepeatMode(m => ((m + 1) % 3) as 0 | 1 | 2);
  const effectiveVol = muted ? 0 : volume;

  const RepeatIcon = repeatMode === 2 ? Repeat1 : Repeat;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Main transport controls */}
      <div className="flex items-center gap-7">
        {/* Shuffle */}
        <motion.button
          onClick={() => setShuffle(v => !v)}
          whileTap={{ scale: 0.88 }}
          className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all"
          style={{ color: shuffle ? primaryColor : 'rgba(255,255,255,0.35)' }}
        >
          <Shuffle size={18} />
          {shuffle && (
            <motion.span
              layoutId="shuffle-dot"
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ background: primaryColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.button>

        {/* Prev */}
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <SkipBack className="w-5 h-5" fill="currentColor" />
        </motion.button>

        {/* Play / Pause — centerpiece */}
        <motion.button
          onClick={onTogglePlay}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${primaryColor}ee, ${primaryColor}99)`,
          }}
          animate={{
            boxShadow: isPlaying
              ? `0 0 0 0px ${primaryColor}44, 0 0 40px ${primaryColor}66, 0 8px 32px rgba(0,0,0,0.5)`
              : `0 0 0 0px transparent, 0 0 20px ${primaryColor}33, 0 8px 24px rgba(0,0,0,0.4)`,
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent pointer-events-none" />

          {/* Pulse ring when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${primaryColor}66` }}
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div key="pause" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Pause className="w-7 h-7 text-white" fill="currentColor" />
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Play className="w-7 h-7 text-white ml-0.5" fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Next */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <SkipForward className="w-5 h-5" fill="currentColor" />
        </motion.button>

        {/* Repeat */}
        <motion.button
          onClick={cycleRepeat}
          whileTap={{ scale: 0.88 }}
          className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all"
          style={{ color: repeatMode > 0 ? primaryColor : 'rgba(255,255,255,0.35)' }}
        >
          <RepeatIcon size={18} />
          {repeatMode > 0 && (
            <motion.span
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ background: primaryColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.button>
      </div>

      {/* Volume Row - Hidden on mobile as hardware keys are preferred */}
      <div
        className="hidden md:flex items-center gap-3 w-full max-w-xs"
        onMouseEnter={() => setVolHovered(true)}
        onMouseLeave={() => setVolHovered(false)}
      >
        <motion.button
          onClick={() => setMuted(v => !v)}
          whileTap={{ scale: 0.88 }}
          className="text-white/40 hover:text-white/70 transition-colors shrink-0"
        >
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>

        {/* Volume slider track */}
        <div className="flex-1 relative flex items-center" style={{ height: 20 }}>
          <div
            className="absolute left-0 inset-y-0 my-auto w-full rounded-full"
            style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}
          />
          <motion.div
            className="absolute left-0 rounded-full"
            style={{
              height: volHovered ? 4 : 3,
              width: `${effectiveVol * 100}%`,
              background: `linear-gradient(90deg, ${primaryColor}99, ${primaryColor})`,
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'height 0.15s ease',
            }}
          />
          {/* Thumb */}
          <motion.div
            className="absolute rounded-full bg-white pointer-events-none origin-center"
            style={{
              width: volHovered ? 14 : 10,
              height: volHovered ? 14 : 10,
              left: `${effectiveVol * 100}%`,
              top: '50%',
              x: '-50%',
              y: '-50%',
              boxShadow: `0 0 0 2px ${primaryColor}44`,
              transition: 'width 0.15s ease, height 0.15s ease',
              opacity: volHovered ? 1 : 0,
            }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={effectiveVol}
            onChange={e => { setVolume(+e.target.value); setMuted(false); }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
