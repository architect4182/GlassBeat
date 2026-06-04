import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { songs } from '../../../data/songs';
import type { Song } from '../../../types/song';

export const TrackCard: React.FC<{ album: Song; onTrackClick: (song: Song) => void }> = ({ album, onTrackClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 cursor-pointer w-[200px]"
      onClick={() => onTrackClick(album)}
    >
      {/* Album Artwork Container */}
      <motion.div
        className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-black/20 shadow-md transition-shadow duration-300 group-hover:shadow-xl"
        animate={{ y: isHovered ? -6 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          layoutId={`album-${album.id}`}
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Subtle Dark Overlay on Hover for Contrast */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Play Button */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: isHovered ? 1 : 0.8,
            opacity: isHovered ? 1 : 0,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center shadow-lg hover:bg-black/60 transition-colors"
        >
          <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
        </motion.button>
      </motion.div>

      {/* Typography */}
      <div className="px-1 flex flex-col gap-1">
        <h3 className="text-[15px] font-medium text-white/90 truncate tracking-tight transition-colors group-hover:text-white">
          {album.title}
        </h3>
        <p className="text-[13px] font-normal text-white/40 truncate tracking-wide">
          {album.artist}
        </p>
      </div>
    </div>
  );
};

export const RecentlyPlayedSection: React.FC<{ onTrackClick: (song: Song) => void }> = ({ onTrackClick }) => {
  // Using the first 8 songs as mock recent albums
  const mockRecentAlbums = songs.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Recently Played</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
      </div>

      {/* Scrollable Container with Glassmorphic Fade */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mockRecentAlbums.map((album) => (
            <TrackCard key={`recent-${album.id}`} album={album} onTrackClick={onTrackClick} />
          ))}
        </div>

        {/* Fade out mask */}
        <div className="absolute top-0 right-0 bottom-6 w-16 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.2), transparent)' }} />
      </div>
    </div>
  );
};
