
import React, { useState, useEffect } from 'react';
import { Meal } from '../types';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface ProductionCardProps {
  meal: Meal;
  count: number;
}

const ProductionCard: React.FC<ProductionCardProps> = ({ meal, count }) => {
  const animatedCount = useAnimatedCounter(count, 800);
  const [pulse, setPulse] = useState(false);
  const prevCountRef = React.useRef(count);

  useEffect(() => {
    if (prevCountRef.current !== count) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
  }, [count]);

  const pulseClass = pulse ? 'animate-pulse-strong' : '';

  return (
    <div className={`bg-white rounded-lg shadow-lg p-5 text-center transition-shadow duration-300 hover:shadow-xl ${pulseClass}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-2 truncate" title={meal.name}>{meal.name}</h3>
      <p className="text-5xl font-bold text-blue-600 tracking-tight">{animatedCount}</p>
      <p className="text-sm text-gray-500">Raciones</p>
       <style>{`
        @keyframes pulse-strong {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.2), 0 4px 6px -4px rgb(59 130 246 / 0.2);
          }
        }
        .animate-pulse-strong {
          animation: pulse-strong 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProductionCard;
