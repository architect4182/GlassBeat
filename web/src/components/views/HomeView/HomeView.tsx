
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Sidebar } from '../../layout/Sidebar';
import { TopBar } from '../../layout/TopBar';
import { RecentlyPlayedSection } from './RecentlyPlayedSection';
import { PopularTracksSection } from './PopularTracksSection';
import { FamousArtistsSection } from './FamousArtistsSection';
import type { Song } from '../../../types/song';

interface HomeViewProps {
  audio: any;
  onTrackClick: (song: Song) => void;
  onSearchOpen: () => void;
}

const hex2rgba = (hex: string, a: number) => {
  if (!hex.startsWith('#')) return `rgba(80,80,180,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const HomeView: React.FC<HomeViewProps> = ({ audio, onTrackClick, onSearchOpen }) => {
  const track = audio.currentSong;

  const p1 = track ? hex2rgba(track.theme.primary, 0.4) : 'rgba(255,255,255,0.1)';
  const p2 = track ? hex2rgba(track.theme.glow, 0.25) : 'rgba(255,255,255,0.05)';

  return (
    <motion.div
      className="relative flex w-full h-full overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* ── Base dark layer ── */}
      <div className="absolute inset-0 bg-slate-950 -z-20" />

      {/* ── Blurred album cover backdrop ── */}
      <AnimatePresence>
        {track && (
          <motion.div
            key={`home-bg-${track.id}`}
            className="absolute inset-0 -z-20"
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
        )}
      </AnimatePresence>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 -z-20" />

      {/* ── Animated ambient orbs ── */}
      {track && (
        <motion.div
          className="absolute inset-0 pointer-events-none -z-20"
          key={`home-orbs-${track.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 800,
              height: 800,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${p1} 0%, ${p2} 40%, transparent 70%)`,
              filter: 'blur(50px)',
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}

      {/* ── Noise grain overlay ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.02] mix-blend-overlay">
        <svg width="100%" height="100%"><filter id="pgrain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#pgrain)" /></svg>
      </div>

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Sidebar - Integrated seamlessly */}
      <Sidebar 
        className="hidden md:flex w-64 z-20 shrink-0" 
        onSearchOpen={onSearchOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden sticky top-0 z-50 flex items-center justify-between p-6 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-xs">GB</span>
            </div>
            <span className="font-bold text-white tracking-wider text-sm">GLASSBEAT</span>
          </div>
          <button 
            onClick={onSearchOpen} 
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Desktop Top Bar */}
        <TopBar className="hidden md:flex sticky top-0 z-40 bg-transparent backdrop-blur-none border-none" />

        {/* Content Sections: Single Flowing Layout */}
        <div className="px-10 py-12 flex flex-col gap-16 pb-40 w-full">

          {/* RECENTLY PLAYED */}
          <RecentlyPlayedSection onTrackClick={onTrackClick} />

          {/* POPULAR TRACKS */}
          <PopularTracksSection audio={audio} onTrackClick={onTrackClick} />

          {/* FAMOUS ARTISTS */}
          <FamousArtistsSection />

        </div>
      </div>
    </motion.div>
  );
};
