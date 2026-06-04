import { Bell, User } from 'lucide-react';

export const TopBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full h-20 px-10 flex items-center justify-end shrink-0 pointer-events-none ${className}`}>
      {/* Right Actions */}
      <div className="flex items-center gap-6 z-10 pointer-events-auto mt-4">
        <button className="w-10 h-10 rounded-full backdrop-blur-md bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] hover:border-white/[0.2] transition-all relative cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] border border-slate-900" />
        </button>
        <button className="w-10 h-10 rounded-full backdrop-blur-md bg-white/[0.08] border border-white/[0.15] flex items-center justify-center hover:bg-white/[0.12] hover:border-white/[0.2] transition-colors overflow-hidden cursor-pointer">
          <User size={18} className="text-white/70" />
        </button>
      </div>
    </div>
  );
}
