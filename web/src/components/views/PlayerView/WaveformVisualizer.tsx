import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  accentColor: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  analyserNode,
  isPlaying,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const smoothRef = useRef<Float32Array>(new Float32Array(128).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const BASE_R = 168; // just outside album art radius
    const MAX_SPIKE = 52;
    const BARS = 128;
    const freqData = new Uint8Array(analyserNode?.frequencyBinCount || 256);

    // Parse accent color to rgb
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgb = hexToRgb(accentColor.startsWith('#') ? accentColor : '#D4B483');

    let idlePhase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      if (analyserNode) {
        analyserNode.getByteFrequencyData(freqData);
      }

      idlePhase += isPlaying ? 0.015 : 0.008;

      for (let i = 0; i < BARS; i++) {
        let target = 0;

        if (analyserNode && isPlaying) {
          const idx = Math.floor((i / BARS) * (freqData.length * 0.75));
          target = freqData[idx] / 255;
        } else {
          // Idle breathing wave
          const wave1 = Math.sin(idlePhase + (i / BARS) * Math.PI * 4) * 0.12;
          const wave2 = Math.sin(idlePhase * 0.7 + (i / BARS) * Math.PI * 6) * 0.06;
          target = Math.max(0, 0.04 + wave1 + wave2);
        }

        // Smooth
        const prev = smoothRef.current[i];
        smoothRef.current[i] = target > prev
          ? prev * 0.4 + target * 0.6
          : prev * 0.82 + target * 0.18;
      }

      // Draw outer glow ring first (soft halo)
      const glowGradient = ctx.createRadialGradient(CX, CY, BASE_R - 10, CX, CY, BASE_R + MAX_SPIKE + 30);
      glowGradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)`);
      glowGradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
      ctx.beginPath();
      ctx.arc(CX, CY, BASE_R + MAX_SPIKE + 30, 0, Math.PI * 2);
      ctx.arc(CX, CY, BASE_R - 10, 0, Math.PI * 2, true);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw each bar as a radial spike
      for (let i = 0; i < BARS; i++) {
        const angle = (i / BARS) * Math.PI * 2 - Math.PI / 2;
        const val = smoothRef.current[i];
        const spikeLen = val * MAX_SPIKE;

        const innerR = BASE_R;
        const outerR = BASE_R + Math.max(2, spikeLen);

        const x1 = CX + Math.cos(angle) * innerR;
        const y1 = CY + Math.sin(angle) * innerR;
        const x2 = CX + Math.cos(angle) * outerR;
        const y2 = CY + Math.sin(angle) * outerR;

        const alpha = 0.35 + val * 0.65;
        const lineWidth = 2.2 + val * 2.8;

        // Draw glow layer
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.4})`;
        ctx.lineWidth = lineWidth + 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${rgb.r},${rgb.g},${rgb.b},0.9)`;
        ctx.shadowBlur = 12 * val;
        ctx.stroke();

        // Draw sharp inner line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      // Thin base circle ring
      ctx.beginPath();
      ctx.arc(CX, CY, BASE_R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.15)`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [analyserNode, isPlaying, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '500px', height: '500px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    />
  );
};
