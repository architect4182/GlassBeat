import { Sidebar } from '../../layout/Sidebar';
import { TopBar } from '../../layout/TopBar';
import { RecentlyPlayedSection } from './RecentlyPlayedSection';
import { PopularTracksSection } from './PopularTracksSection';
import type { Song } from '../../../types/song';

interface HomeViewProps {
  audio: any; // Using any here to quickly accept the useAudioPlayer return type
  onTrackClick: (song: Song) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ audio, onTrackClick }) => {
  return (
    <div className="flex w-full h-full">
      {/* Sidebar with Glassmorphism */}
      <Sidebar className="w-64 border-r border-white/10 backdrop-blur-md z-20 shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Top Bar (Actions only, since Search moved to Sidebar) */}
        <TopBar className="sticky top-0 z-40" />

        {/* Content Sections */}
        <div className="px-10 py-4 space-y-16 pb-56 max-w-[1400px] mx-auto">
          {/* Section 1: Recently Played */}
          <RecentlyPlayedSection onTrackClick={onTrackClick} />

          {/* Section 2: Popular Tracks */}
          <PopularTracksSection audio={audio} onTrackClick={onTrackClick} />
        </div>
      </div>
    </div>
  );
};
