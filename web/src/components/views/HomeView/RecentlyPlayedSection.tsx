import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { songs } from '../../../data/songs';
import type { Song } from '../../../types/song';

const RecentlyPlayedCard: React.FC<{ album: Song; onTrackClick: (song: Song) => void }> = ({ album, onTrackClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-52 cursor-pointer"
      onClick={() => onTrackClick(album)}
    >
      {/* Glassmorphic Container */}
      <div className="backdrop-blur-md bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.08]">
        {/* Album Image with Layered Depth */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-black/20">
          {/* Base Image */}
          <motion.img
            layoutId={`album-${album.id}`}
            src={album.cover}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay Gradient for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Hover Glow Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 mix-blend-screen pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${album.theme.primary}40, transparent)`,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Play Button with Glassmorphism */}
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0.8,
              opacity: isHovered ? 1 : 0,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-3 right-3 w-12 h-12 rounded-full backdrop-blur-md bg-white/[0.15] border border-white/[0.2] flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.4)] hover:bg-white/[0.25] transition-all"
          >
            <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
          </motion.button>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5 px-1">
          <h3 className="text-[15px] font-semibold text-white/90 truncate group-hover:text-white transition-colors" style={{ color: isHovered ? album.theme.primary : undefined }}>
            {album.title}
          </h3>
          <p className="text-[13px] font-medium text-white/40 truncate">
            {album.artist}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const RecentlyPlayedSection: React.FC<{ onTrackClick: (song: Song) => void }> = ({ onTrackClick }) => {
  // Using the first 4 songs as mock recent albums
  const mockRecentAlbums = songs.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Recently Played</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
      </div>

      {/* Scrollable Container with Glassmorphic Fade */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mockRecentAlbums.map((album) => (
            <RecentlyPlayedCard key={`recent-${album.id}`} album={album} onTrackClick={onTrackClick} />
          ))}
        </div>

        {/* Glassmorphic Fade on Right Edge */}
        <div className="absolute top-0 right-0 bottom-4 w-32 bg-gradient-to-l from-[#0A0E27] via-[#0A0E27]/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
