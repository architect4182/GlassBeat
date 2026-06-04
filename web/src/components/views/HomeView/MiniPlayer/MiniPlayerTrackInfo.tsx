import { motion } from 'framer-motion';
import type { Song } from '../../../../../types/song';

interface MiniPlayerTrackInfoProps {
  track: Song;
}

export const MiniPlayerTrackInfo: React.FC<MiniPlayerTrackInfoProps> = ({ track }) => {
  return (
    <motion.div
      className="flex-1 min-w-0 space-y-1 pr-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-[15px] font-semibold text-white truncate tracking-wide">
        {track.title}
      </h3>

      <p className="text-[13px] text-white/60 font-medium truncate tracking-wide">
        {track.artist}
      </p>
    </motion.div>
  );
};
