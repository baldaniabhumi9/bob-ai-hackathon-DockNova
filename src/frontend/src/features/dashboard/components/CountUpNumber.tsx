import React, { useEffect, useState } from 'react';

interface CountUpNumberProps {
  end: number;
  duration?: number; // ms
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  duration = 1500,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease-out quad formula
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = easedProgress * end;

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  const formattedNumber = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
