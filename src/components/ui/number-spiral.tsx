/**
 * Number Spiral — Enhanced animated golden spiral with sacred geometry
 * Inspired by 21st.dev spiral animation
 * Features: Fibonacci spiral, orbiting particles, concentric rings, glow effects
 */
import { useEffect, useRef } from "react";

interface NumberSpiralProps {
  centerNumber: number;
  color?: string;
  size?: number;
  secondaryColor?: string;
}

export function NumberSpiral({ centerNumber, color = "#f59e0b", size = 180, secondaryColor = "#8b5cf6" }: NumberSpiralProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let t = 0;
    let frame: number;
    const PHI = 1.618033988749;

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const primary = hexToRgb(color);
    const secondary = hexToRgb(secondaryColor);

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const maxR = size * 0.42;

      // === Sacred geometry: Concentric rings ===
      for (let i = 0; i < 4; i++) {
        const ringR = (maxR * (i + 1)) / 4.5;
        const ringAlpha = 0.04 + Math.sin(t * 0.5 + i * 0.8) * 0.02;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${ringAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 6 + i * 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // === Fibonacci Spiral path ===
      ctx.beginPath();
      const maxAngle = 5 * Math.PI;
      const spiralPoints = 200;
      for (let i = 0; i < spiralPoints; i++) {
        const progress = i / spiralPoints;
        const angle = progress * maxAngle + t * 0.3;
        const r = 4 * Math.pow(PHI, (angle / (2 * Math.PI)) * 0.7);
        if (r > maxR) break;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const spiralGrad = ctx.createLinearGradient(0, 0, size, size);
      const shift = (Math.sin(t) + 1) / 2;
      spiralGrad.addColorStop(0, `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.35 + shift * 0.15})`);
      spiralGrad.addColorStop(0.5, `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, 0.2)`);
      spiralGrad.addColorStop(1, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.08)`);
      ctx.strokeStyle = spiralGrad;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.stroke();

      // === Spiral dots (placed along the spiral) ===
      for (let i = 0; i < 80; i++) {
        const progress = i / 80;
        const angle = progress * maxAngle + t * 0.3;
        const r = 4 * Math.pow(PHI, (angle / (2 * Math.PI)) * 0.7);
        if (r > maxR) continue;

        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const alpha = Math.max(0.05, (1 - progress) * 0.6);
        const dotSize = 0.5 + (1 - progress) * 1.5;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${alpha})`;
        ctx.fill();
      }

      // === Orbiting particles ===
      for (let d = 0; d < 4; d++) {
        const orbitR = 20 + d * 15;
        const orbitSpeed = 0.8 + d * 0.3;
        const orbitAngle = t * orbitSpeed + d * (Math.PI / 2);
        const ox = cx + orbitR * Math.cos(orbitAngle);
        const oy = cy + orbitR * Math.sin(orbitAngle);
        const particleSize = 2 - d * 0.3;

        // Glow
        const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, particleSize * 4);
        glow.addColorStop(0, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.3)`);
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(ox, oy, particleSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Particle
        ctx.beginPath();
        ctx.arc(ox, oy, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.7 - d * 0.1})`;
        ctx.fill();
      }

      // === Center glow ===
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      centerGlow.addColorStop(0, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.1)`);
      centerGlow.addColorStop(0.5, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.03)`);
      centerGlow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      // === Center number ===
      ctx.font = `bold ${size * 0.2}px 'Playfair Display', Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Text glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 25;
      ctx.fillStyle = color;
      ctx.fillText(String(centerNumber), cx, cy);
      ctx.shadowBlur = 15;
      ctx.fillText(String(centerNumber), cx, cy);
      ctx.shadowBlur = 0;

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [centerNumber, color, size, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none"
    />
  );
}
