import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const fmt = (t: number) => {
  if (isNaN(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface ScrubberBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  primaryColor: string;
}

export const ScrubberBar: React.FC<ScrubberBarProps> = ({ currentTime, duration, onSeek, primaryColor }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const displayTime = isDragging ? dragTime : currentTime;
  const pct = duration > 0 ? Math.min(100, (displayTime / duration) * 100) : 0;

  const calc = (clientX: number) => {
    if (!trackRef.current || duration === 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const t = p * duration;
    setDragTime(t);
    onSeek(t);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    calc(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => { if (isDragging) calc(e.clientX); };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full space-y-3">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative flex items-center cursor-pointer select-none"
        style={{ height: 20 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Track groove */}
        <div className="absolute left-0 inset-y-0 my-auto w-full rounded-full" style={{ height: 4, background: 'rgba(255,255,255,0.08)' }} />

        {/* Buffered ghost (decorative) */}
        <div
          className="absolute left-0 rounded-full"
          style={{ height: 4, width: `${Math.min(pct + 15, 100)}%`, background: 'rgba(255,255,255,0.07)', top: '50%', transform: 'translateY(-50%)' }}
        />

        {/* Filled progress */}
        <motion.div
          className="absolute left-0 rounded-full"
          style={{
            height: (hovered || isDragging) ? 5 : 4,
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${primaryColor}cc, ${primaryColor})`,
            top: '50%',
            transform: 'translateY(-50%)',
            boxShadow: `0 0 12px ${primaryColor}88`,
            transition: 'height 0.15s ease',
          }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute rounded-full bg-white pointer-events-none origin-center"
          style={{
            width: (hovered || isDragging) ? 18 : 13,
            height: (hovered || isDragging) ? 18 : 13,
            left: `${pct}%`,
            top: '50%',
            x: '-50%',
            y: '-50%',
            boxShadow: `0 0 0 3px ${primaryColor}55, 0 2px 8px rgba(0,0,0,0.5)`,
            transition: 'width 0.15s ease, height 0.15s ease, box-shadow 0.2s ease',
          }}
          animate={{ scale: isDragging ? 1.25 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </div>

      {/* Time labels */}
      <div className="flex justify-between">
        <span className="text-xs font-semibold text-white/40 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
          {fmt(displayTime)}
        </span>
        <span className="text-xs font-semibold text-white/25 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
          {fmt(duration)}
        </span>
      </div>
    </div>
  );
};
