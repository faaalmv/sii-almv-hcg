
import { useState, useEffect, useRef } from 'react';

export const useAnimatedCounter = (endValue: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  const startValue = useRef(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startValue.current = count;
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }
      
      const progress = timestamp - startTime.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease-out function
      const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);

      const currentValue = startValue.current + (endValue - startValue.current) * easeOutPercentage;
      
      setCount(Math.round(currentValue));

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, duration]);
  
  // Directly set if initial value is already correct
  useEffect(() => {
    setCount(endValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return count;
};
