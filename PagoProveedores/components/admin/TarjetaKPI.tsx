import React, { useState, useEffect } from 'react';

interface TarjetaKPIProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'red' | 'green';
  formatAsCurrency?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-100 border-blue-300 text-blue-800',
  amber: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  red: 'bg-red-100 border-red-300 text-red-800',
  green: 'bg-green-100 border-green-300 text-green-800',
};

export const TarjetaKPI: React.FC<TarjetaKPIProps> = ({ title, value, icon, color, formatAsCurrency = false, onClick }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const frameRate = 60; // 60 fps
    const totalFrames = animationDuration / (1000 / frameRate);
    const increment = value / totalFrames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const newDisplayValue = Math.min(value, displayValue + increment);
      setDisplayValue(newDisplayValue);

      if (currentFrame >= totalFrames || newDisplayValue >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (formatAsCurrency) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);
    }
    return Math.round(val).toLocaleString('es-MX');
  };

  return (
    <div 
        className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClasses[color]} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${colorClasses[color].replace('border-','bg-').split(' ')[0]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(displayValue)}</p>
        </div>
      </div>
    </div>
  );
};
