import React from 'react';

interface FolioStampProps {
  number: number;
  timestamp: Date;
}

const formatFolioNumber = (num: number) => `F.R.A. ${String(num).padStart(7, '0')}`;
    
const formatTimestamp = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('es-MX', { month: 'short' }).toUpperCase().replace('.', '');
    const year = String(date.getFullYear()).slice(-2);
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0) as 12 AM
    
    const strHours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year}  ${strHours}:${minutes}-${ampm}`;
};

const FolioStamp: React.FC<FolioStampProps> = ({ number, timestamp }) => {
  return (
    <div className="absolute top-4 right-4 font-mono text-red-600 text-center text-xs leading-tight select-none print:text-black">
      <p className="tracking-wider font-bold">{formatFolioNumber(number)}</p>
      <p className="tracking-wider">{formatTimestamp(timestamp)}</p>
      <p className="tracking-wider">ALMACEN DE VIVERES FAA SALIDA</p>
    </div>
  );
};

export default FolioStamp;
