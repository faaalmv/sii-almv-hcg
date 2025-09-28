import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { initialData } from './data/initialData';
import { Group, Meal } from './types';
import SchedulingTable from './components/SchedulingTable';
import DailySchedulingTable from './components/DailySchedulingTable';
import CustomSelect from './components/CustomSelect';
import Tabs from './components/Tabs';
import Toast from '../../common/Toast';
import Icon from '../../common/icons/Icon';


const months = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];
const monthOptions = months.map(m => ({ value: m, label: m.charAt(0) + m.slice(1).toLowerCase() }));

const services = ['PACIENTES', 'COMEDOR', 'NUTRICIÓN CLÍNICA'];
const serviceOptions = services.map(s => ({ value: s, label: s }));

const App: React.FC = () => {
  const [data, setData] = useState<Group[]>(initialData);
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0]);
  const [selectedService, setSelectedService] = useState<string>(services[0]);
  const [filterText, setFilterText] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'warning' } | null>(null);
  const [activeTab, setActiveTab] = useState('programacion');

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    initialData.forEach(group => {
      initialState[group.name] = true;
    });
    return initialState;
  });

  const tabs = [
    { id: 'programacion', label: 'Programación' },
    { id: 'diaria', label: 'Diaria' },
    { id: 'consolidado', label: 'Consolidado' },
  ];

  const handleValueChange = useCallback((itemCode: string, dayIndex: number, value: number) => {
    setData(prevData => 
      prevData.map(group => ({
        ...group,
        items: group.items.map(item => {
          if (item.code === itemCode) {
            const newDailyValues = [...item.dailyValues];
            newDailyValues[dayIndex] = Math.max(0, value);
            return { ...item, dailyValues: newDailyValues };
          }
          return item;
        })
      }))
    );
  }, []);
  
  const handleDailyValueChange = useCallback((itemCode: string, day: number, meal: Meal, value: number) => {
    setData(prevData =>
      prevData.map(group => ({
        ...group,
        items: group.items.map(item => {
          if (item.code === itemCode) {
            // Create a deep copy of the schedule to avoid mutation issues
            const newSchedule = JSON.parse(JSON.stringify(item.dailySchedule));
            newSchedule[day][meal] = Math.max(0, value);
            return { ...item, dailySchedule: newSchedule };
          }
          return item;
        }),
      }))
    );
  }, []);

  const handleToggleGroup = useCallback((groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  }, []);

  const handleExportCSV = useCallback(() => {
    const escapeCsvCell = (cellData: any): string => {
      const cell = String(cellData);
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    };

    let csvContent = '';
    let headers: string[] = [];
    const rows: string[][] = [];
    
    headers.push('Código', 'Descripción', 'Unidad', 'Máximo', 'Total', 'Disponible');
    
    if (activeTab === 'diaria') {
        const meals: ('Desayuno' | 'Comida' | 'Cena')[] = ['Desayuno', 'Comida', 'Cena'];
        for (let day = 1; day <= 31; day++) {
            meals.forEach(meal => headers.push(`Día ${day} - ${meal}`));
        }
        
        data.forEach(group => {
            group.items.forEach(item => {
                const total = Object.values(item.dailySchedule).reduce((daySum, meals) => {
                    return daySum + (meals.desayuno || 0) + (meals.comida || 0) + (meals.cena || 0);
                }, 0);
                const available = item.maxQuantity - total;

                const row: (string | number)[] = [item.code, item.description, item.unit, item.maxQuantity, total, available];

                for (let day = 1; day <= 31; day++) {
                    row.push(item.dailySchedule[day]?.desayuno ?? 0);
                    row.push(item.dailySchedule[day]?.comida ?? 0);
                    row.push(item.dailySchedule[day]?.cena ?? 0);
                }
                rows.push(row.map(escapeCsvCell));
            });
        });

    } else { // 'programacion' and 'consolidado' tabs
        for (let day = 1; day <= 31; day++) {
            headers.push(`Día ${day}`);
        }
        
        data.forEach(group => {
            group.items.forEach(item => {
                const total = item.dailyValues.reduce((sum, val) => sum + (val || 0), 0);
                const available = item.maxQuantity - total;

                const row = [item.code, item.description, item.unit, item.maxQuantity, total, available, ...item.dailyValues];
                rows.push(row.map(escapeCsvCell));
            });
        });
    }

    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const fileName = `Programacion_${selectedMonth}_${selectedService.replace(/\s+/g, '_')}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [data, activeTab, selectedMonth, selectedService]);

  const filteredData = useMemo(() => {
    const searchTerm = filterText.trim().toLowerCase();
    if (!searchTerm) {
        return data;
    }

    const result: Group[] = [];

    for (const group of data) {
        const groupNameMatches = group.name.toLowerCase().includes(searchTerm);
        
        const matchingItems = group.items.filter(item => 
            item.description.toLowerCase().includes(searchTerm) ||
            item.code.toLowerCase().includes(searchTerm)
        );

        if (groupNameMatches) {
            // If group name matches, include the whole group and all its items
            result.push(group);
        } else if (matchingItems.length > 0) {
            // If only items match, include the group but with only the matching items
            result.push({ ...group, items: matchingItems });
        }
    }
    return result;
  }, [data, filterText]);
  
  const showToast = useCallback((message: string, type: 'warning' = 'warning') => {
    setToast({ message, type });
  }, []);

  return (
    <div className="min-h-screen text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <header className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 sticky top-4 z-30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-left">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight uppercase" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900 }}>
                Programación Mensual
              </h1>
              <p className="text-violet-600 mt-2 text-xl font-bold uppercase tracking-wider">
                {selectedMonth.charAt(0) + selectedMonth.slice(1).toLowerCase()} - {selectedService}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <CustomSelect
                  id="month-select"
                  label="Mes"
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                />
              </div>
              <div className="w-full sm:w-48">
                <CustomSelect
                  id="service-select"
                  label="Servicio"
                  options={serviceOptions}
                  value={selectedService}
                  onChange={setSelectedService}
                />
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 ease-in-out whitespace-nowrap"
                aria-label="Exportar datos a CSV"
              >
                <Icon.Export className="w-5 h-5" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          <div className="mb-6 w-full md:w-1/2">
            <div className="group relative flex items-center w-full bg-white rounded-lg focus-within:ring-2 focus-within:ring-violet-500 transition-all duration-200 ease-in-out shadow-sm">
                <div className="pl-4 pointer-events-none">
                  <Icon.Search className="h-5 w-5 text-slate-500 group-focus-within:text-violet-500 transition-colors duration-200 ease-in-out" />
                </div>
                <input
                  type="search"
                  placeholder="Buscar por código, descripción o grupo..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="block w-full pl-2 pr-4 py-2.5 text-sm text-slate-900 bg-transparent placeholder-slate-500 focus:outline-none"
                  aria-label="Filtrar artículos"
                />
            </div>
          </div>

          <main>
            {activeTab === 'diaria' ? (
              <DailySchedulingTable
                data={filteredData}
                onValueChange={handleDailyValueChange}
                expandedGroups={expandedGroups}
                onToggleGroup={handleToggleGroup}
                showToast={showToast}
              />
            ) : (
              // "Programacion" and "Consolidado" share the same component for now
              <SchedulingTable 
                data={filteredData} 
                onValueChange={handleValueChange}
                expandedGroups={expandedGroups}
                onToggleGroup={handleToggleGroup}
                showToast={showToast}
              />
            )}
          </main>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
