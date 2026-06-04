import { useState } from 'react';
import { motion } from 'framer-motion';
import { famousArtists } from '../../../data/artists';
import type { Artist } from '../../../data/artists';

export const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 cursor-pointer w-[200px]"
    >
      {/* Artist Image Container */}
      <motion.div
        className="relative aspect-square mb-4 overflow-hidden rounded-full bg-black/20 shadow-md transition-shadow duration-300 group-hover:shadow-xl"
        animate={{ y: isHovered ? -6 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Subtle Dark Overlay on Hover for Contrast */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </motion.div>

      {/* Typography */}
      <div className="px-1 flex flex-col gap-1 items-center text-center">
        <h3 className="text-[15px] font-medium text-white/90 truncate tracking-tight transition-colors group-hover:text-white">
          {artist.name}
        </h3>
        <p className="text-[13px] font-normal text-white/40 truncate tracking-wide">
          Artist
        </p>
      </div>
    </div>
  );
};

export const FamousArtistsSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Famous Artists</h2>
        <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mt-2" />
      </div>

      {/* Scrollable Container with Glassmorphic Fade */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {famousArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {/* Fade out mask */}
        <div className="absolute top-0 right-0 bottom-6 w-16 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.2), transparent)' }} />
      </div>
    </div>
  );
};
