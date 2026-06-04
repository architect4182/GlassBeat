import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface ScrubberBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  primaryColor: string;
}

export const ScrubberBar: React.FC<ScrubberBarProps> = ({ currentTime, duration, onSeek, primaryColor }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercentage = duration > 0 ? (displayTime / duration) * 100 : 0;

  const updateProgress = (clientX: number) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setDragTime(percentage * duration);
    onSeek(percentage * duration);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateProgress(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) updateProgress(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full max-w-lg space-y-4">
      {/* Progress Bar Container with Glassmorphism */}
      <motion.div
        ref={progressBarRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-2.5 rounded-full backdrop-blur-md bg-white/[0.1] border border-white/[0.15] cursor-pointer group"
        animate={{
          boxShadow: isDragging
            ? `0 0 20px ${primaryColor}40`
            : `0 0 10px ${primaryColor}20`,
        }}
      >
        {/* Filled Progress */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: primaryColor }}
          animate={{
            width: `${progressPercentage}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Hover Highlight */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: `${primaryColor}80` }}
          animate={{
            width: `${progressPercentage}%`,
            opacity: isDragging ? 0.8 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Draggable Thumb */}
        <motion.div
          className="absolute top-1/2 w-5 h-5 rounded-full bg-white shadow-lg -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ boxShadow: `0 0 15px ${primaryColor}80` }}
          animate={{
            left: `calc(${progressPercentage}% - 10px)`,
            scale: isDragging ? 1.3 : 1,
          }}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>

      {/* Time Display */}
      <div className="flex justify-between text-[13px] font-semibold tracking-wider text-white/50 font-mono">
        <span>{formatTime(displayTime)}</span>
        <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
      </div>
    </div>
  );
};
