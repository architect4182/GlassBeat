import { motion } from 'framer-motion';

interface MiniPlayerProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  accentColor: string;
}

export const MiniPlayerProgressBar: React.FC<MiniPlayerProgressBarProps> = ({
  progress,
  duration,
  onSeek,
  isDragging,
  setIsDragging,
  accentColor,
}) => {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateProgress(e.clientX, e.currentTarget);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) updateProgress(e.clientX, e.currentTarget);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const updateProgress = (clientX: number, target: HTMLDivElement) => {
    if (duration === 0) return;
    const rect = target.getBoundingClientRect();
    const newProgress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(newProgress * duration);
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1.5 overflow-visible cursor-pointer group/bar pointer-events-auto"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      animate={{
        boxShadow: isDragging
          ? `0 -2px 16px ${accentColor}60, inset 0 0 8px ${accentColor}30`
          : `0 -2px 8px ${accentColor}20, inset 0 0 4px ${accentColor}10`,
      }}
    >
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/[0.1]" />

      {/* Filled Progress */}
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{ backgroundColor: accentColor }}
        animate={{
          width: `${progress * 100}%`,
        }}
        transition={{
          type: "spring",
          stiffness: isDragging ? 200 : 300,
          damping: 30,
        }}
      />

      {/* Hover Highlight */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-white/[0.4]"
        animate={{
          width: `${progress * 100}%`,
          opacity: isDragging ? 0.6 : 0,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Scrubber Thumb (only visible on hover/drag) */}
      <motion.div
        className="absolute top-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-y-1/2 pointer-events-none opacity-0 group-hover/bar:opacity-100 transition-opacity"
        animate={{
          left: `calc(${progress * 100}% - 6px)`,
          scale: isDragging ? 1.5 : 1,
          opacity: isDragging ? 1 : undefined,
        }}
        transition={{
          type: "spring",
          stiffness: isDragging ? 200 : 300,
          damping: 30,
        }}
      />
    </motion.div>
  );
};
