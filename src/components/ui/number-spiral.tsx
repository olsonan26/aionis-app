/**
 * Number Spiral — animated spiral of numbers radiating from center.
 * Inspired by 21st.dev spiral animation.
 */
import { useEffect, useRef } from "react";

interface NumberSpiralProps {
  centerNumber: number;
  color?: string;
  size?: number;
}

export function NumberSpiral({ centerNumber, color = "#f59e0b", size = 180 }: NumberSpiralProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let t = 0;
    let frame: number;

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Draw spiral dots
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 6 + t;
        const radius = 8 + (i / 60) * (size * 0.38);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const alpha = Math.max(0.05, 1 - (i / 60) * 0.85);
        const dotSize = 1 + (1 - i / 60) * 1.5;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }

      // Center number
      ctx.font = `bold ${size * 0.22}px 'Playfair Display', Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fillText(String(centerNumber), cx, cy);
      ctx.shadowBlur = 0;

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [centerNumber, color, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none"
    />
  );
}
