import { useState } from 'react';
import { Home, Library, Heart, Clock, Search, User } from 'lucide-react';
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

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-white/[0.08] via-white/[0.05] to-transparent border-r border-white/[0.1]",
        className
      )}
    >
      {/* Logo Area with Glassmorphic Card */}
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/[0.3]" />
          <span className="font-bold text-white text-lg tracking-wider">GLASSBEAT</span>
        </div>

        {/* Search Bar - Glassmorphic */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search playlists..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg backdrop-blur-md bg-white/[0.08] border border-white/[0.15] text-white placeholder-white/40 focus:bg-white/[0.12] focus:border-white/[0.25] outline-none transition-all text-sm"
          />
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
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer",
                activeSection === item.id
                  ? "backdrop-blur-md bg-white/[0.12] border border-white/[0.2] text-white shadow-lg shadow-black/20"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent"
              )}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Library Section */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest px-4 mb-3">
            Playlists
          </h4>
          {libraryItems.map((item) => (
            <button
              key={item.id}
              className="w-full text-left px-4 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all text-sm truncate cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer - User Profile */}
      <div className="p-6 border-t border-white/[0.1]">
        <button className="w-full flex items-center justify-center gap-3 backdrop-blur-md bg-white/[0.08] border border-white/[0.15] rounded-xl px-4 py-3.5 text-white text-sm font-medium hover:bg-white/[0.12] hover:border-white/[0.2] transition-all cursor-pointer">
          <User className="w-4 h-4" />
          Profile
        </button>
      </div>
    </aside>
  );
};
