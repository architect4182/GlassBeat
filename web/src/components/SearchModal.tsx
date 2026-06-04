import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchYouTube } from '../services/youtube';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (videoId: string, result: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onResultClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchYouTube(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#121218]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search songs, artists, or albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none px-4 text-white placeholder-white/30 text-lg"
              />
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10">
              {isSearching && searchResults.length === 0 && (
                <div className="p-12 text-center text-white/40">Searching...</div>
              )}
              
              {!isSearching && searchQuery && searchResults.length === 0 && (
                <div className="p-12 text-center text-white/40">No results found for "{searchQuery}"</div>
              )}
              
              {searchResults.length > 0 && (
                <div className="p-2 flex flex-col gap-1">
                  {searchResults.map((result) => {
                    const videoId = result.id?.videoId;
                    if (!videoId) return null;
                    const { title, channelTitle, thumbnails } = result.snippet;
                    const thumb = thumbnails?.default?.url || thumbnails?.medium?.url;
                    
                    return (
                      <div
                        key={videoId}
                        onClick={() => {
                          onResultClick(videoId, result);
                          setSearchQuery("");
                          onClose();
                        }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.08] cursor-pointer transition-colors group"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-black/40">
                          <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[15px] font-medium text-white/90 truncate" dangerouslySetInnerHTML={{ __html: title }} />
                          <span className="text-[13px] text-white/40 truncate">{channelTitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
