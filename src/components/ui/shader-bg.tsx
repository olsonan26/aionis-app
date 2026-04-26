/**
 * WebGL Animated Shader Background
 * Inspired by 21st.dev animated-shader-background & shader-background
 * Creates a fluid, organic gradient mesh that moves like liquid
 */
import { useEffect, useRef, useCallback } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  
  vec3 palette(float t) {
    vec3 a = vec3(0.05, 0.02, 0.08);
    vec3 b = vec3(0.04, 0.03, 0.06);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.10, 0.53, 0.73);
    return a + b * cos(6.28318 * (c * t + d));
  }
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * smoothNoise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.15;
    
    // Multiple flowing noise layers
    float n1 = fbm(uv * 3.0 + t * 0.3);
    float n2 = fbm(uv * 2.0 - t * 0.2 + vec2(5.2, 1.3));
    float n3 = fbm(uv * 4.0 + t * 0.1 + vec2(n1, n2));
    
    // Blend colors
    vec3 col1 = palette(n1 * 0.4 + t * 0.05);        // Deep purples/blues
    vec3 col2 = vec3(0.95, 0.65, 0.15) * 0.06;        // Amber glow
    vec3 col3 = vec3(0.35, 0.20, 0.75) * 0.04;        // Violet
    vec3 col4 = vec3(0.06, 0.70, 0.80) * 0.03;        // Cyan
    
    vec3 color = col1;
    color += col2 * smoothstep(0.3, 0.7, n2);
    color += col3 * smoothstep(0.4, 0.8, n3);
    color += col4 * smoothstep(0.5, 0.9, n1 * n2);
    
    // Vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= vignette * 0.8 + 0.2;
    
    // Keep it dark and subtle
    color *= 0.35;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const frameRef = useRef<number>(0);
  const startTime = useRef(Date.now());

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return false;

    // Create shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.warn("Shader compile error, falling back to CSS bg");
      return false;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return false;
    }

    // Create fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    glRef.current = gl;
    programRef.current = program;
    return true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5); // Cap DPR for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      if (glRef.current) {
        glRef.current.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const success = initGL();
    if (!success) return;

    const animate = () => {
      const gl = glRef.current;
      const program = programRef.current;
      if (!gl || !program) return;

      const time = (Date.now() - startTime.current) / 1000;
      
      const timeLoc = gl.getUniformLocation(program, "u_time");
      const resLoc = gl.getUniformLocation(program, "u_resolution");
      
      gl.uniform1f(timeLoc, time);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initGL]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

/**
 * Fallback CSS animated background for devices without WebGL
 */
export function CSSShaderFallback() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#06060c]" />
      <div className="shader-orb shader-orb-1" />
      <div className="shader-orb shader-orb-2" />
      <div className="shader-orb shader-orb-3" />
      <div className="shader-orb shader-orb-4" />
      <div className="shader-orb shader-orb-5" />
      <style>{`
        .shader-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: shaderFloat 20s ease-in-out infinite;
        }
        .shader-orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(251,191,36,0.07), transparent 70%);
          top: 20%; left: 30%;
          animation-duration: 25s;
        }
        .shader-orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%);
          top: 50%; left: 60%;
          animation-duration: 22s;
          animation-delay: -5s;
        }
        .shader-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(6,182,212,0.05), transparent 70%);
          top: 70%; left: 20%;
          animation-duration: 28s;
          animation-delay: -10s;
        }
        .shader-orb-4 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(244,63,94,0.04), transparent 70%);
          top: 10%; left: 70%;
          animation-duration: 30s;
          animation-delay: -15s;
        }
        .shader-orb-5 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(251,191,36,0.03), transparent 60%);
          top: 40%; left: 40%;
          animation-duration: 35s;
          animation-delay: -8s;
        }
        @keyframes shaderFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(40px, 20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

/**
 * Smart background that uses WebGL if available, falls back to CSS
 */
export function SmartShaderBackground() {
  const supportsWebGL = typeof document !== "undefined" && (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch { return false; }
  })();

  return supportsWebGL ? <ShaderBackground /> : <CSSShaderFallback />;
}
