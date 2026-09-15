import React, { useEffect, useRef } from 'react';

export interface HarborCanvasProps {
  density?: 'low' | 'normal' | 'high';
  speed?: number;
  interactive?: boolean;
  className?: string;
}

interface Vessel {
  x: number;
  y: number;
  laneIndex: number;
  progress: number;
  speed: number;
  trail: { x: number; y: number; timestamp: number }[];
  size: number;
  pulsePhase: number;
  label: string;
}

interface Point {
  x: number;
  y: number;
}

interface Lane {
  start: Point;
  cp1: Point;
  cp2: Point;
  end: Point;
}

export const HarborCanvas: React.FC<HarborCanvasProps> = ({
  density = 'normal',
  speed = 1.0,
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animFrameId: number;
    let isVisible = true;
    let isTabActive = !document.hidden;

    // Canvas size handling
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Visibility & Intersection Observers
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Mouse interactivity
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mousePosRef.current = null;
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Determine vessel count based on screen width & density prop
    const isMobile = width < 768;
    const targetVesselCount = isMobile
      ? 5
      : density === 'low'
      ? 6
      : density === 'high'
      ? 12
      : 9;

    // Port Center (SGSIN-01) - fixed slightly right of center
    const portCenter: Point = {
      get x() {
        return width * 0.58;
      },
      get y() {
        return height * 0.48;
      },
    };

    // 4 Bezier Shipping Lanes terminating at Port Center
    const getLanes = (): Lane[] => [
      {
        start: { x: width * -0.05, y: height * 0.2 },
        cp1: { x: width * 0.25, y: height * 0.1 },
        cp2: { x: width * 0.45, y: height * 0.35 },
        end: { x: portCenter.x, y: portCenter.y },
      },
      {
        start: { x: width * 0.1, y: height * 1.1 },
        cp1: { x: width * 0.2, y: height * 0.7 },
        cp2: { x: width * 0.4, y: height * 0.55 },
        end: { x: portCenter.x, y: portCenter.y },
      },
      {
        start: { x: width * 1.05, y: height * 0.15 },
        cp1: { x: width * 0.85, y: height * 0.25 },
        cp2: { x: width * 0.7, y: height * 0.4 },
        end: { x: portCenter.x, y: portCenter.y },
      },
      {
        start: { x: width * 0.9, y: height * 1.05 },
        cp1: { x: width * 0.75, y: height * 0.8 },
        cp2: { x: width * 0.65, y: height * 0.6 },
        end: { x: portCenter.x, y: portCenter.y },
      },
    ];

    // Cubic Bezier Point Calculation
    const getBezierPoint = (lane: Lane, t: number): Point => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * lane.start.x + 3 * uu * t * lane.cp1.x + 3 * u * tt * lane.cp2.x + ttt * lane.end.x;
      const y = uuu * lane.start.y + 3 * uu * t * lane.cp1.y + 3 * u * tt * lane.cp2.y + ttt * lane.end.y;

      return { x, y };
    };

    // Initialize Vessels
    const vesselPrefixes = ['MV-EVER', 'COSCO-', 'MAERSK-', 'ONE-', 'CMA-', 'HAPAG-', 'OOCL-'];
    const vessels: Vessel[] = Array.from({ length: targetVesselCount }, (_, i) => {
      const laneIndex = i % 4;
      const progress = (i / targetVesselCount + Math.random() * 0.1) % 1;
      return {
        x: 0,
        y: 0,
        laneIndex,
        progress,
        speed: (0.0003 + Math.random() * 0.0004) * speed,
        trail: [],
        size: 3 + Math.random() * 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
        label: `${vesselPrefixes[i % vesselPrefixes.length]}${101 + i}`,
      };
    });

    let radarAngle = 0;
    let lastTime = performance.now();

    // Main Draw Function
    const renderFrame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background Deep Nautical Base
      const bgGradient = ctx.createRadialGradient(
        portCenter.x,
        portCenter.y,
        50,
        portCenter.x,
        portCenter.y,
        Math.max(width, height) * 0.9
      );
      bgGradient.addColorStop(0, '#0D1B2A');
      bgGradient.addColorStop(0.6, '#0A1420');
      bgGradient.addColorStop(1, '#060D15');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Bathymetric Contour Lines
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.setLineDash([4, 6]);

      const drawBathymetric = (cx: number, cy: number, rx: number, ry: number, rotateDeg: number) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, (rotateDeg * Math.PI) / 180, 0, Math.PI * 2);
        ctx.stroke();
      };

      drawBathymetric(width * 0.5, height * 0.45, width * 0.4, height * 0.3, 15);
      drawBathymetric(width * 0.52, height * 0.48, width * 0.28, height * 0.22, -10);
      drawBathymetric(width * 0.55, height * 0.5, width * 0.18, height * 0.14, 25);
      ctx.restore();

      // 3. Draw Lat/Lon Graticule Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.font = '9px "JetBrains Mono", monospace';

      const gridSize = 100;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        const lon = (103 + (x / width) * 0.2).toFixed(2);
        ctx.fillText(`103°${lon}'E`, x + 4, height - 8);
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        const lat = (1 + (1 - y / height) * 0.3).toFixed(2);
        ctx.fillText(`1°${lat}'N`, 8, y - 4);
      }
      ctx.restore();

      // 4. Draw Bezier Shipping Lanes
      const lanes = getLanes();
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.setLineDash([3, 5]);

      lanes.forEach((lane) => {
        ctx.beginPath();
        ctx.moveTo(lane.start.x, lane.start.y);
        ctx.bezierCurveTo(lane.cp1.x, lane.cp1.y, lane.cp2.x, lane.cp2.y, lane.end.x, lane.end.y);
        ctx.stroke();
      });
      ctx.restore();

      // 5. Draw Central Radar Sweep on SGSIN-01 Port Marker
      const radarRadius = Math.min(width, height) * 0.38;
      ctx.save();
      ctx.translate(portCenter.x, portCenter.y);

      // Concentric Radar Rings
      [0.25, 0.5, 0.75, 1.0].forEach((rRatio) => {
        ctx.beginPath();
        ctx.arc(0, 0, radarRadius * rRatio, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Rotating Radar Sector Beam
      if (!prefersReducedMotion) {
        radarAngle += (Math.PI / 6) * dt; // Slow 12s full rotation
      }

      const radarGrad = ctx.createConicGradient(radarAngle, 0, 0);
      radarGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
      radarGrad.addColorStop(0.12, 'rgba(56, 189, 248, 0.03)');
      radarGrad.addColorStop(0.25, 'transparent');
      radarGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(0, 0, radarRadius, 0, Math.PI * 2);
      ctx.fillStyle = radarGrad;
      ctx.fill();

      // Port Marker (SGSIN-01)
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Port Label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('PORT: SGSIN-01', 18, 4);

      ctx.restore();

      // 6. Update & Draw Vessels & AIS Trails
      vessels.forEach((v) => {
        if (!prefersReducedMotion) {
          v.progress += v.speed;
          if (v.progress >= 0.98) {
            v.progress = 0.02; // Loop back softly
            v.trail = [];
          }
        }

        const currentPos = getBezierPoint(lanes[v.laneIndex], v.progress);
        v.x = currentPos.x;
        v.y = currentPos.y;

        // Push to trail history
        if (!prefersReducedMotion) {
          v.trail.push({ x: v.x, y: v.y, timestamp: now });
          // Keep 6 seconds trail history
          v.trail = v.trail.filter((pt) => now - pt.timestamp <= 6000);
        }

        // Draw AIS Fading Trail
        if (v.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(v.trail[0].x, v.trail[0].y);

          for (let i = 1; i < v.trail.length; i++) {
            ctx.lineTo(v.trail[i].x, v.trail[i].y);
          }

          const trailGrad = ctx.createLinearGradient(
            v.trail[0].x,
            v.trail[0].y,
            v.x,
            v.y
          );
          trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          trailGrad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');

          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        // Vessel Pulsing Glow Ring
        v.pulsePhase += 0.04;
        const pulseRadius = v.size + 4 + Math.sin(v.pulsePhase) * 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(v.x, v.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing Vessel Core Dot
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size, 0, Math.PI * 2);
        ctx.fillStyle = '#38BDF8';
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Vessel Identifier Tag
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(v.label, v.x + 8, v.y - 6);

        ctx.restore();
      });

      // 7. Interactive Mouse Spotlight / Vector Line (if enabled)
      if (interactive && mousePosRef.current) {
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;

        ctx.save();
        const mouseGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 160);
        mouseGrad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
        mouseGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 160, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Loop animation if active and visible
      if (!prefersReducedMotion && isVisible && isTabActive) {
        animFrameId = requestAnimationFrame(renderFrame);
      }
    };

    // Initial render
    if (prefersReducedMotion) {
      renderFrame(performance.now());
    } else {
      animFrameId = requestAnimationFrame(renderFrame);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      if (interactive && canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [density, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      aria-label="Animated Nautical Chart and Live AIS Radar View"
    />
  );
};

export default HarborCanvas;
