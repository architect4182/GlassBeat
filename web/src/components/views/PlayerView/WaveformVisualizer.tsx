import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  accentColor: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ analyserNode, isPlaying, accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution for crisp rendering
    const width = 600;
    const height = 80;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    const frequencies = new Uint8Array(256);
    
    // We want dense mirrored bars
    const barCount = 48; // One side of the mirror
    const totalBars = barCount * 2;
    const barTotalSpace = width / totalBars;
    const barWidth = barTotalSpace * 0.6;
    const barGap = barTotalSpace * 0.4;
    const centerY = height / 2;

    const smoothedValues = new Array(barCount).fill(0);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!analyserNode) {
        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
        return;
      }

      analyserNode.getByteFrequencyData(frequencies);

      for (let i = 0; i < barCount; i++) {
        // Map 48 bars to the lower/mid frequencies
        const freqIndex = Math.floor((i / barCount) * 100);
        const value = frequencies[freqIndex] / 255;
        
        // High smoothing factor
        if (value > smoothedValues[i]) {
          smoothedValues[i] = value * 0.5 + smoothedValues[i] * 0.5;
        } else {
          smoothedValues[i] = smoothedValues[i] * 0.85;
        }

        const smoothedValue = smoothedValues[i];
        
        // Base height 4px
        const barHeight = Math.max(4, smoothedValue * (height - 10));

        // Draw Right Side
        const xRight = (width / 2) + (i * (barWidth + barGap)) + (barGap / 2);
        
        // Draw Left Side (mirrored index)
        const xLeft = (width / 2) - ((i + 1) * (barWidth + barGap)) + (barGap / 2);

        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 10 * smoothedValue;
        
        const radius = Math.min(barWidth / 2, barHeight / 2);

        // Right bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(xRight, centerY - barHeight / 2, barWidth, barHeight, radius);
        } else {
          ctx.rect(xRight, centerY - barHeight / 2, barWidth, barHeight);
        }
        ctx.fill();

        // Left bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(xLeft, centerY - barHeight / 2, barWidth, barHeight, radius);
        } else {
          ctx.rect(xLeft, centerY - barHeight / 2, barWidth, barHeight);
        }
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(render);
    } else {
      render(); // Draw initial/paused frame
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [analyserNode, isPlaying, accentColor]);

  return (
    <div className="w-full flex justify-center py-2">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};
