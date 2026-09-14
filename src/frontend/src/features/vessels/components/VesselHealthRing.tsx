import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface VesselHealthRingProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
}

export const VesselHealthRing: React.FC<VesselHealthRingProps> = ({
  score,
  size = 110,
  strokeWidth = 9,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Score color thresholds
  const getColor = (val: number) => {
    if (val > 80) return '#34D399'; // Success green
    if (val >= 50) return '#FBBF24'; // Warning amber
    return '#F87171'; // Danger red
  };

  const color = getColor(score);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const duration = 1500; // 1.5s animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      setAnimatedScore(Math.round(easedProgress * score));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setAnimatedScore(score);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1C2840"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated colored progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.05s ease',
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />
      </svg>

      {/* Center text score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold tracking-tight text-text-primary">
          {animatedScore}
        </span>
        <span className="text-[10px] font-mono text-text-muted uppercase">Health</span>
      </div>
    </div>
  );
};

export default VesselHealthRing;
