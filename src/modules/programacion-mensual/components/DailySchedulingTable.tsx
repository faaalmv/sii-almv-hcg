import React, { memo, useMemo, useState, useRef, useCallback } from 'react';
import { Group, Item, Meal } from '../types';
import { DailyTableRow } from './DailyTableRow';
import Icon from '../../../common/icons/Icon';

interface DailySchedulingTableProps {
  data: Group[];
  onValueChange: (itemCode: string, day: number, meal: Meal, value: number) => void;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (groupName: string) => void;
  showToast: (message: string, type?: 'warning') => void;
}

const groupColorMap: Record<string, string> = {
  'GRUPO DE ALIMENTO: ABARROTES': '#636e72',
  'GRUPO DE ALIMENTO: CARNES': '#8d4b4b',
  'GRUPO DE ALIMENTO: SALCHICHONERIA': '#6c5b7b',
  'GRUPO DE ALIMENTO: FRUTAS': '#6a7a4f',
  'GRUPO DE ALIMENTO: LACTEOS': '#5a7d9a',
  'GRUPO DE ALIMENTO: AVES Y HUEVO': '#a37e4f',
  'GRUPO DE ALIMENTO: PESCADOS Y MARISCOS': '#3b7f7f',
  'GRUPO DE ALIMENTO: PANADERIA Y TORTILLERIA': '#8a6b52',
  'GRUPO DE ALIMENTO: SEMILLAS Y CEREALES': '#a1662f',
  'GRUPO DE ALIMENTO: VERDURAS Y HORTALIZAS': '#4a6b54',
  'GRUPO DE ALIMENTO: CONGELADOS': '#809fb8',
  'GRUPO: OTROS': '#636e72',
};

const DailyTableHeader: React.FC<{ onFocusDay: (day: number) => void; onBlurDay: () => void; isScrolled: boolean }> = ({ onFocusDay, onBlurDay, isScrolled }) => {
  const baseClasses = "border-b border-r border-gray-200 text-xs font-medium uppercase tracking-wider";
  const headerRow1Classes = "text-slate-600 bg-gray-50/95 backdrop-blur-sm";
  const headerRow2Classes = "text-slate-500 bg-gray-50/95 backdrop-blur-sm";
  const summaryClasses = "text-blue-800 bg-blue-50/95 backdrop-blur-sm hover:bg-blue-100";
const baseHeaderClasses = "border-b border-r border-gray-200 text-xs font-medium uppercase tracking-wider";
const headerRow1Classes = "text-slate-600 bg-gray-50/95 backdrop-blur-sm";
const headerRow2Classes = "text-slate-500 bg-gray-50/95 backdrop-blur-sm";
const summaryClasses = "text-blue-800 bg-blue-50/95 backdrop-blur-sm hover:bg-blue-100";
const stickyTop0 = "sticky top-0 z-20";
const stickyTop48 = "sticky top-[48px] z-20";

  // Per directive, th elements need to be sticky
  const stickyTop0 = "sticky top-0 z-20";
  const stickyTop48 = "sticky top-[48px] z-20";
const colCodigoClasses = `${baseHeaderClasses} ${headerRow1Classes} ${stickyTop0} px-6 text-left left-0 w-32 z-30 py-4`;
const colDescripcionClasses = `${baseHeaderClasses} ${headerRow1Classes} ${stickyTop0} px-6 text-left left-[128px] w-64 z-30 py-4`;
const colUnidadClasses = `${baseHeaderClasses} ${headerRow1Classes} ${stickyTop0} px-6 text-center left-[384px] w-28 z-30 py-4 transition-shadow duration-200`;
const colTotalClasses = `${baseHeaderClasses} ${summaryClasses} ${stickyTop0} px-6 text-center right-[136px] z-20 w-20 border-l border-gray-300 py-4`;
const colDisponibleClasses = `${baseHeaderClasses} ${summaryClasses} ${stickyTop0} px-6 text-center right-[56px] z-20 w-20 py-4`;
const colStatusClasses = `${baseHeaderClasses} ${summaryClasses} ${stickyTop0} px-6 text-center right-0 z-20 w-14 border-r-0 py-4`;

const DailyTableHeader: React.FC<{ onFocusDay: (day: number) => void; onBlurDay: () => void; isScrolled: boolean }> = ({ onFocusDay, onBlurDay, isScrolled }) => {
  return (
    <thead>
      <tr className="h-[48px]">
        {/* Fixed columns with rowspan */}
        <th scope="col" rowSpan={2} className={`${baseClasses} ${headerRow1Classes} ${stickyTop0} px-6 text-left left-0 w-32 z-30 py-4`}>
        <th scope="col" rowSpan={2} className={colCodigoClasses}>
          Código
        </th>
        <th scope="col" rowSpan={2} className={`${baseClasses} ${headerRow1Classes} ${stickyTop0} px-6 text-left left-[128px] w-64 z-30 py-4`}>
        <th scope="col" rowSpan={2} className={colDescripcionClasses}>
          Descripción
        </th>
        <th scope="col" rowSpan={2} className={`${baseClasses} ${headerRow1Classes} ${stickyTop0} px-6 text-center left-[384px] w-28 z-30 py-4 transition-shadow duration-200 ${isScrolled ? 'sticky-col-shadow' : ''}`}>
        <th scope="col" rowSpan={2} className={`${colUnidadClasses} ${isScrolled ? 'sticky-col-shadow' : ''}`}>
          Unidad
        </th>

        {/* Day columns with colspan */}
        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
          <th 
            key={day} 
            scope="colgroup" 
            colSpan={3} 
            className={`${baseClasses} ${headerRow1Classes} ${stickyTop0} px-3 text-center`}
            className={`${baseHeaderClasses} ${headerRow1Classes} ${stickyTop0} px-3 text-center`}
            onMouseEnter={() => onFocusDay(day)}
            onMouseLeave={onBlurDay}
          >
            {day}
          </th>
        ))}

        {/* Summary columns with rowspan */}
        <th scope="col" rowSpan={2} className={`${baseClasses} ${summaryClasses} ${stickyTop0} px-6 text-center right-[136px] z-20 w-20 border-l border-gray-300 py-4`}>
          Total
        </th>
        <th scope="col" rowSpan={2} className={`${baseClasses} ${summaryClasses} ${stickyTop0} px-6 text-center right-[56px] z-20 w-20 py-4`}>
          Disponible
        </th>
        <th scope="col" rowSpan={2} className={`${baseClasses} ${summaryClasses} ${stickyTop0} px-6 text-center right-0 z-20 w-14 border-r-0 py-4`}>
          Status
        </th>
      </tr>
      
      <tr className="h-[36px]">
        {/* Meal columns */}
        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
          <React.Fragment key={day}>
            <th scope="col" className={`${baseClasses} ${headerRow2Classes} ${stickyTop48} px-2 text-center`}>Des</th>
            <th scope="col" className={`${baseClasses} ${headerRow2Classes} ${stickyTop48} px-2 text-center border-l border-dotted border-gray-200`}>Com</th>
            <th scope="col" className={`${baseClasses} ${headerRow2Classes} ${stickyTop48} px-2 text-center border-l border-dotted border-gray-200`}>Cen</th>
          </React.Fragment>
        ))}
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
    if (!items || items.length === 0) return { itemCount: 0, availablePercent: 100, progressBarColor: 'bg-teal-400' };
    
    const totalMax = items.reduce((acc, item) => acc + item.maxQuantity, 0);
    const totalScheduled = items.reduce((acc, item) => acc + Object.values(item.dailySchedule).reduce((daySum, meals) => daySum + (meals.desayuno || 0) + (meals.comida || 0) + (meals.cena || 0), 0), 0);
    const available = totalMax - totalScheduled;
    const availablePercent = totalMax > 0 ? (available / totalMax) * 100 : 100;

    let progressBarColor = 'bg-rose-500';
    if (availablePercent >= 75) progressBarColor = 'bg-teal-400';
    else if (availablePercent >= 50) progressBarColor = 'bg-sky-400';
    else if (availablePercent >= 25) progressBarColor = 'bg-amber-400';
    else if (availablePercent > 0) progressBarColor = 'bg-orange-500';

    return { itemCount: items.length, availablePercent: Math.max(0, availablePercent), progressBarColor };
  }, [items]);

  return (
    <tr
      className={`row-transition cursor-pointer group hover:z-20 focus-within:z-20 hover:scale-[1.01] focus-within:scale-[1.01] hover:-translate-y-1 focus-within:-translate-y-1 hover:shadow-lg focus-within:shadow-lg ${isExpanded ? 'sticky top-[85px] z-10' : ''}`}
      role="button"
      tabIndex={0}
      style={{ backgroundColor, color: '#F8F9FA', borderBottom: isExpanded ? `1px solid rgba(0, 0, 0, 0.2)` : 'none' }}
      onClick={() => onToggle(name)}
      aria-expanded={isExpanded}
    >
      <td colSpan={100} className="p-0">
        <div className="flex items-center justify-between w-full p-3">
          <div className="flex items-center gap-4">
            <Icon.ChevronDown className={`h-6 w-6 text-current opacity-80 transform transition-transform duration-300 ease-out ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
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

const DailySchedulingTable: React.FC<DailySchedulingTableProps> = ({ data, onValueChange, expandedGroups, onToggleGroup, showToast }) => {
  const MemoizedDailyTableRow = memo(DailyTableRow);
  const [isScrolled, setIsScrolled] = useState(false);
  const [focusedDay, setFocusedDay] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setIsScrolled(scrollContainerRef.current.scrollLeft > 0);
    }
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="overflow-auto rounded-xl max-h-[calc(100vh-280px)] shadow-[0px_15px_40px_rgba(0,0,0,0.1),_0px_5px_15px_rgba(0,0,0,0.08)]"
    >
      <table className="w-full border-collapse table-fixed bg-white product-table">
        <DailyTableHeader 
          onFocusDay={setFocusedDay}
          onBlurDay={() => setFocusedDay(null)}
          isScrolled={isScrolled} 
        />
        <tbody>
          {data.map((group) => {
            const isExpanded = expandedGroups[group.name] ?? true;
            const backgroundColor = groupColorMap[group.name] || '#636e72';
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
                  <MemoizedDailyTableRow
                    key={item.code}
                    item={item}
                    onValueChange={onValueChange}
                    showToast={showToast}
                    isScrolled={isScrolled}
                    groupColor={backgroundColor}
                    focusedDay={focusedDay}
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

export default DailySchedulingTable;