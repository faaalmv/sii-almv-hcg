import React, { useRef, useEffect } from 'react';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const getCtx = () => canvasRef.current?.getContext('2d');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    const ctx = getCtx();
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (value && value.startsWith('data:image/png')) {
      const image = new Image();
      image.src = value;
      image.onload = () => {
        if (canvasRef.current) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, [value]);

  const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const event = e instanceof MouseEvent ? e : e.touches[0];
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoords(e.nativeEvent);
    if (!coords) return;
    const ctx = getCtx();
    if (!ctx) return;
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const coords = getCoords(e.nativeEvent);
    if (!coords) return;
    const ctx = getCtx();
    if (!ctx) return;
    
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = getCtx();
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="relative flex-grow bg-gray-50 rounded-t-md">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="w-full text-center text-xs py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors border-t border-gray-300 text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
      >
        Limpiar
      </button>
    </div>
  );
};

export default SignaturePad;
