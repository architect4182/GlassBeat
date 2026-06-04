import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';

interface CenterPanelProps {
  track: any;
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ track, isPlaying, analyserNode }) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center gap-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Album Art + Ambient Waveform Container */}
      <div className="relative flex items-center justify-center w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] mb-4">
        {/* Ambient radial waveform around art */}
        <WaveformVisualizer
          analyserNode={analyserNode}
          isPlaying={isPlaying}
          accentColor={track.theme.primary}
        />

        {/* Deep glow bloom behind art */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${track.theme.primary}55 0%, ${track.theme.glow}22 50%, transparent 75%)`,
            filter: 'blur(28px)',
          }}
          animate={{ scale: isPlaying ? [1, 1.08, 1] : 1, opacity: isPlaying ? [0.7, 1, 0.7] : 0.5 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Album Art */}
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl w-full h-full"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: isPlaying ? 1.015 : 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
            {/* Specular highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.15] pointer-events-none" />
            {/* Subtle inner border */}
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/[0.08] pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Track Info + Like */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${track.id}`}
          className="flex items-center gap-5 w-full max-w-md px-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-[1.75rem] font-bold tracking-tight truncate leading-tight text-white">
              {track.title}
            </h1>
            <p className="text-base text-white/60 font-medium mt-1 truncate tracking-wide">
              {track.artist}
            </p>
          </div>

          <motion.button
            onClick={() => setLiked(v => !v)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{
              background: liked ? `${track.theme.primary}22` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${liked ? track.theme.primary + '55' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <Heart
              className="w-5 h-5 transition-all"
              style={{ color: liked ? track.theme.primary : 'rgba(255,255,255,0.4)' }}
              fill={liked ? track.theme.primary : 'none'}
            />
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
