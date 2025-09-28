import React, { memo, useMemo, useState, useRef } from 'react';
import { Group, Item } from '../types';
import { TableRow } from './TableRow';
import { ChevronDownIcon } from './icons';

interface SchedulingTableProps {
  data: Group[];
  onValueChange: (itemCode: string, dayIndex: number, value: number) => void;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (groupName: string) => void;
  showToast: (message: string, type?: 'warning') => void;
}

const groupColorMap: Record<string, string> = {
  'GRUPO DE ALIMENTO: ABARROTES': '#636e72',
  'GRUPO DE ALIMENTO: CARNES': '#8d4b4b',
  'GRUPO DE ALIMENTO: SALCHICHONERIA': '#6c5b7b',
  'GRUPO DE ALIMENTO: FRUTAS': '#6a7a4f', // Changed to Green
  'GRUPO DE ALIMENTO: LACTEOS': '#5a7d9a',
  'GRUPO DE ALIMENTO: AVES Y HUEVO': '#a37e4f',
  'GRUPO DE ALIMENTO: PESCADOS Y MARISCOS': '#3b7f7f',
  'GRUPO DE ALIMENTO: PANADERIA Y TORTILLERIA': '#8a6b52',
  'GRUPO DE ALIMENTO: SEMILLAS Y CEREALES': '#a1662f', // Changed to Toasted Sienna
  'GRUPO DE ALIMENTO: VERDURAS Y HORTALIZAS': '#4a6b54',
  'GRUPO DE ALIMENTO: CONGELADOS': '#809fb8',
  'GRUPO: OTROS': '#636e72', // Using a neutral color as fallback
};

const TableHeader: React.FC<{ onHoverColumn: (index: number | null) => void; isScrolled: boolean }> = ({ onHoverColumn, isScrolled }) => {
  const baseClasses = "py-4 border-b border-r border-gray-200 text-xs font-medium uppercase tracking-wider transition-colors duration-200 ease-in-out";
  const normalClasses = "text-slate-600 bg-gray-50 hover:bg-gray-100";
  const summaryClasses = "text-blue-800 bg-blue-50 hover:bg-blue-100";
  
  return (
    <thead className="sticky top-0 z-20">
      <tr>
        {/* Fixed Columns */}
        <th className={`${baseClasses} ${normalClasses} px-6 text-left sticky left-0 w-32 z-30`}>
          Código
        </th>
        <th className={`${baseClasses} ${normalClasses} px-6 text-left sticky left-[128px] w-64 z-30`}>
          Descripción
        </th>
        <th className={`${baseClasses} ${normalClasses} px-6 text-center sticky left-[384px] w-28 z-30 transition-shadow duration-200 ${isScrolled ? 'sticky-col-shadow' : ''}`}>
          Unidad
        </th>
        
        {/* Day Columns */}
        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
          <th 
            key={day} 
            className={`${baseClasses} ${normalClasses} px-3 text-center w-16 min-w-[4rem]`}
            onMouseEnter={() => onHoverColumn(day - 1)}
            onMouseLeave={() => onHoverColumn(null)}
          >
            {day}
          </th>
        ))}
        
        {/* Summary Columns */}
        <th className={`${baseClasses} ${summaryClasses} px-6 text-center sticky right-[136px] z-20 w-20 border-l border-gray-300`}>
          Total
        </th>
        <th className={`${baseClasses} ${summaryClasses} px-6 text-center sticky right-[56px] z-20 w-20`}>
          Disponible
        </th>
        <th className={`${baseClasses} ${summaryClasses} px-6 text-center sticky right-0 z-20 w-14 border-r-0`}>
          Status
        </th>
      </tr>
    </thead>
  );
};

interface GroupHeaderProps {
  name: string;
  items: Item[];
  isExpanded: boolean;
  onToggle: (name: string) => void;
  backgroundColor: string;
}

const GroupHeader: React.FC<GroupHeaderProps> = memo(({ name, items, isExpanded, onToggle, backgroundColor }) => {
  const summary = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        itemCount: 0,
        availablePercent: 100,
        progressBarColor: 'bg-teal-400',
      };
    }
    
    const totalMax = items.reduce((acc, item) => acc + item.maxQuantity, 0);
    const totalScheduled = items.reduce((acc, item) => acc + item.dailyValues.reduce((sum, val) => sum + (val || 0), 0), 0);
    const available = totalMax - totalScheduled;
    const availablePercent = totalMax > 0 ? (available / totalMax) * 100 : 100;

    let progressBarColor = 'bg-rose-500';
    if (availablePercent >= 75) progressBarColor = 'bg-teal-400';
    else if (availablePercent >= 50) progressBarColor = 'bg-sky-400';
    else if (availablePercent >= 25) progressBarColor = 'bg-amber-400';
    else if (availablePercent > 0) progressBarColor = 'bg-orange-500';

    return {
      itemCount: items.length,
      availablePercent: Math.max(0, availablePercent),
      progressBarColor,
    };
  }, [items]);

  return (
    <tr
      className={`row-transition cursor-pointer group hover:z-20 focus-within:z-20 hover:scale-[1.01] focus-within:scale-[1.01] hover:-translate-y-1 focus-within:-translate-y-1 hover:shadow-lg focus-within:shadow-lg ${isExpanded ? 'sticky top-[65px] z-10' : ''}`}
      style={{ 
        backgroundColor: backgroundColor, 
        color: '#F8F9FA',
        borderBottom: isExpanded ? `1px solid rgba(0, 0, 0, 0.2)` : 'none' 
      }}
      onClick={() => onToggle(name)}
      aria-expanded={isExpanded}
    >
      <td colSpan={37} className="p-0">
        <div className="flex items-center justify-between w-full p-3">
          <div className="flex items-center gap-4">
            <ChevronDownIcon className={`h-6 w-6 text-current opacity-80 transform transition-transform duration-300 ease-out ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm uppercase tracking-wider">{name}</span>
              <span className="text-xs text-current opacity-70 font-normal">{summary.itemCount} artículos</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-1/3 max-w-xs" title={`Disponibilidad: ${Math.round(summary.availablePercent)}%`}>
            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${summary.progressBarColor}`}
                style={{ width: `${summary.availablePercent}%` }}
                role="progressbar"
                aria-valuenow={summary.availablePercent}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <span className="text-sm font-semibold w-16 text-right">{Math.round(summary.availablePercent)}%</span>
          </div>
        </div>
      </td>
    </tr>
  );
});

const SchedulingTable: React.FC<SchedulingTableProps> = ({ data, onValueChange, expandedGroups, onToggleGroup, showToast }) => {
  const MemoizedTableRow = memo(TableRow);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setIsScrolled(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="overflow-auto rounded-xl max-h-[calc(100vh-280px)] shadow-[0px_15px_40px_rgba(0,0,0,0.1),_0px_5px_15px_rgba(0,0,0,0.08)]"
    >
      <table className="w-full border-collapse table-fixed bg-white product-table">
        <TableHeader onHoverColumn={setHoveredColumn} isScrolled={isScrolled} />
        <tbody>
          {data.map((group) => {
            const isExpanded = expandedGroups[group.name] ?? true;
            const backgroundColor = groupColorMap[group.name] || '#636e72'; // Fallback color
            return (
              <React.Fragment key={group.name}>
                <GroupHeader
                  name={group.name}
                  items={group.items}
                  isExpanded={isExpanded}
                  onToggle={onToggleGroup}
                  backgroundColor={backgroundColor}
                />
                {isExpanded && group.items.map((item, index) => (
                  <MemoizedTableRow
                    key={item.code}
                    item={item}
                    onValueChange={onValueChange}
                    showToast={showToast}
                    hoveredColumn={hoveredColumn}
                    isScrolled={isScrolled}
                    groupColor={backgroundColor}
                    style={{ animationDelay: `${index * 30}ms` }}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulingTable;