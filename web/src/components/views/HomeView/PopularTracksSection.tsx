import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Visualizer } from '../../Visualizer/Visualizer';
import { songs } from '../../../data/songs';
import type { Song } from '../../../types/song';

const TrackListItem: React.FC<{
  track: Song;
  idx: number;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}> = ({ track, idx, isActive, isPlaying, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onPlay}
      className="group cursor-pointer relative"
    >
      {/* Glassmorphic Row with Hover Effect */}
      <div 
        className={`backdrop-blur-sm border rounded-xl px-6 py-4 transition-all duration-300 ${
          isActive 
            ? 'bg-white/[0.08] border-white/[0.15] shadow-lg' 
            : 'bg-white/[0.02] border-white/[0.03] hover:backdrop-blur-md hover:bg-white/[0.06] hover:border-white/[0.1]'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Left: Index/Visualizer */}
          <div className="w-10 text-center text-sm font-medium relative z-10 flex justify-start items-center">
            {isActive ? (
              <Visualizer isPlaying={isPlaying} color={track.theme.primary} />
            ) : (
              <span className="text-white/30 group-hover:text-white/70 transition-colors font-mono">{String(idx + 1).padStart(2, '0')}</span>
            )}
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-5 flex-1 min-w-0 pr-8">
            {/* Album Art Thumbnail */}
            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-white/5 bg-black/20">
              <motion.img
                layoutId={`album-${track.id}`}
                src={track.cover}
                alt={track.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex flex-col justify-center gap-1">
              <h3 
                className="text-[15px] font-semibold text-white/90 truncate transition-colors"
                style={{ color: isActive || isHovered ? track.theme.primary : undefined }}
              >
                {track.title}
              </h3>
              <p className="text-[13px] font-medium text-white/40 truncate group-hover:text-white/60 transition-colors">
                {track.artist}
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-6 ml-4">
            <span className="text-[13px] text-white/30 font-medium font-mono group-hover:text-white/50 transition-colors">
              {track.duration}
            </span>

            {/* Play Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isHovered || isActive ? 1 : 0,
                scale: isHovered || isActive ? 1 : 0.9,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.1] border border-white/[0.15] text-white hover:bg-white/[0.2] hover:border-white/[0.25]'
              }`}
            >
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            </motion.button>
          </div>
        </div>

        {/* Ambient Glow behind active row */}
        {isActive && (
          <div 
            className="absolute inset-0 -z-10 rounded-xl opacity-20 blur-xl pointer-events-none"
            style={{ backgroundColor: track.theme.primary }}
          />
        )}
      </div>
    </motion.div>
  );
};

export const PopularTracksSection: React.FC<{
  audio: any;
  onTrackClick: (song: Song) => void;
}> = ({ audio, onTrackClick }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Popular Tracks</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
      </div>

      <div className="space-y-3">
        {songs.map((track, idx) => (
          <TrackListItem
            key={track.id}
            track={track}
            idx={idx}
            isActive={audio.currentSong.id === track.id}
            isPlaying={audio.isPlaying}
            onPlay={() => onTrackClick(track)}
          />
        ))}
      </div>
    </div>
  );
};
