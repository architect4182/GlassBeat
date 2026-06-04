import { motion } from 'framer-motion';

interface VisualizerProps {
  isPlaying: boolean;
  color: string;
}

export function Visualizer({ isPlaying, color }: VisualizerProps) {
  const bars = [1, 2, 3, 4];
  
  return (
    <div className="flex items-end gap-[3px] h-4">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 rounded-t-sm"
          style={{ backgroundColor: color }}
          animate={
            isPlaying
              ? { height: ['20%', '100%', '30%', '80%', '20%'] }
              : { height: '20%' }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.8 + bar * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatType: 'mirror',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
