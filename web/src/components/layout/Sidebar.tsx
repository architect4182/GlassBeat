import { useState } from 'react';
import { Home, Library, Heart, Clock, Search, User, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'library', label: 'Library', icon: <Library className="w-5 h-5" /> },
  { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
  { id: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5" /> },
];

const libraryItems = [
  { id: 'p1', label: 'Night Drive' },
  { id: 'p2', label: 'Focus Focus' },
  { id: 'p3', label: 'Jazz Essentials' },
  { id: 'p4', label: 'Electronic Chill' },
];

export const Sidebar: React.FC<{ 
  className?: string;
  onSearchOpen?: () => void;
}> = ({ className, onSearchOpen }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [playlistsOpen, setPlaylistsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-transparent border-r border-white/5",
        className
      )}
    >
      {/* Logo Area with Glassmorphic Card */}
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/[0.3]" />
          <span className="font-bold text-white text-lg tracking-wider">GLASSBEAT</span>
        </div>

        {/* Search Bar Trigger */}
        <div className="relative">
          <button 
            onClick={onSearchOpen}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg backdrop-blur-md bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/40">Search...</span>
            </div>
            <span className="text-[10px] font-semibold text-white/30 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 shadow-sm">
              ⌘ K
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest px-4 mb-3">
            Menu
          </h4>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 cursor-pointer",
                activeSection === item.id
                  ? "backdrop-blur-xl bg-white/10 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <div className={activeSection === item.id ? "text-white" : "text-white/40"}>
                {item.icon}
              </div>
              <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Library Section */}
        <div className="space-y-1">
          <button 
            onClick={() => setPlaylistsOpen(!playlistsOpen)}
            className="w-full flex items-center justify-between px-4 mb-2 group cursor-pointer"
          >
            <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
              Playlists
            </h4>
            {playlistsOpen ? <ChevronDown className="w-3 h-3 text-white/40" /> : <ChevronRight className="w-3 h-3 text-white/40" />}
          </button>
          
          {playlistsOpen && (
            <div className="space-y-0.5">
              {libraryItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.03] transition-all text-[13px] truncate cursor-pointer tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer - User Profile */}
      <div className="p-6 border-t border-white/5">
        <button className="w-full flex items-center justify-center gap-3 bg-transparent rounded-xl px-4 py-3.5 text-white/50 text-[13px] font-medium hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer">
          <User className="w-4 h-4" />
          Profile
        </button>
      </div>
    </aside>
  );
};
