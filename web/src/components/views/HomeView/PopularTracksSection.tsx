
import { songs } from '../../../data/songs';
import { TrackCard } from './RecentlyPlayedSection';
import type { Song } from '../../../types/song';

export const PopularTracksSection: React.FC<{
  audio: any;
  onTrackClick: (song: Song) => void;
}> = ({ onTrackClick }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Popular Tracks</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
      </div>

      {/* Scrollable Container with Glassmorphic Fade */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {songs.map((track) => (
            <TrackCard
              key={`popular-${track.id}`}
              album={track}
              onTrackClick={onTrackClick}
            />
          ))}
        </div>

        {/* Fade out mask */}
        <div className="absolute top-0 right-0 bottom-6 w-16 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.2), transparent)' }} />
      </div>
    </div>
  );
};
