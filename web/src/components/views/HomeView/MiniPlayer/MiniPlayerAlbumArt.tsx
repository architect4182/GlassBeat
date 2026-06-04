import { motion } from 'framer-motion';
import type { Song } from '../../../../types/song';

interface MiniPlayerAlbumArtProps {
  track: Song;
  isPlaying: boolean;
}

export const MiniPlayerAlbumArt: React.FC<MiniPlayerAlbumArtProps> = ({ track, isPlaying }) => {
  return (
    <motion.div
      className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-lg"
      animate={{
        scale: isPlaying ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: isPlaying ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {/* Album Image */}
      <motion.img
        layoutId={`album-${track.id}`}
        src={track.cover}
        alt={track.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

      {/* Glassmorphic Border with Dynamic Glow */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-white/[0.3]"
        animate={{
          boxShadow: isPlaying
            ? `0 0 16px ${track.theme.primary}80`
            : `0 0 8px ${track.theme.primary}40`,
        }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
};
