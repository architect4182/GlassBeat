import { motion } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { Song } from '../../../types/song';
import { Visualizer } from '../../Visualizer/Visualizer';

export const QueuePanel: React.FC<{
  currentTrack: Song;
  playlist?: Song[];
  currentIndex?: number;
  onClose: () => void;
  onTrackClick?: (song: Song) => void;
}> = ({ currentTrack, playlist = [], currentIndex = 0, onClose, onTrackClick }) => {
  
  const queue = playlist.slice(currentIndex + 1, currentIndex + 11);

  return (
    <>
      <motion.div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] z-50 backdrop-blur-[40px] bg-white/[0.05] border-l border-white/[0.12] p-8 overflow-y-auto flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.25)]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="flex justify-between items-center mb-10 mt-6">
          <h3 className="text-2xl font-bold text-white tracking-wider">Up Next</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Current Track indicator */}
        <div className="mb-6 pb-6 border-b border-white/[0.05]">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Now Playing</h4>
          <div className="flex items-center gap-4 bg-white/[0.08] p-3 rounded-2xl border border-white/[0.1]">
            <Visualizer isPlaying={true} color={currentTrack.theme.primary} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-white truncate" style={{ color: currentTrack.theme.primary }}>
                {currentTrack.title}
              </p>
              <p className="text-[13px] text-white/50 font-medium truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {queue.map((track, idx) => (
            <motion.div
              key={`queue-${track.id}-${idx}`}
              onClick={() => {
                if (onTrackClick) {
                  onTrackClick(track);
                }
              }}
              className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.08] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all cursor-pointer border border-transparent hover:border-white/[0.1]"
              whileHover={{ x: 4 }}
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                <img src={track.cover} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-white/90 group-hover:text-white transition-colors truncate">
                  {track.title}
                </p>
                <p className="text-[13px] text-white/50 group-hover:text-white/70 transition-colors truncate">
                  {track.artist}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};
