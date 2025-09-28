
import React, { useState, useCallback, useMemo } from 'react';
import { mockContratos } from './data/mockData';
// Fix: Imported ContractStatus to resolve 'Cannot find name' error.
import { Contrato, IncidenceType, IncidenceStatus, MilestoneStatus, Penalizacion, ContractStatus } from './types';
import DashboardPrincipal from './components/DashboardPrincipal';
import ListaContratos from './components/ListaContratos';
import DetalleContratoView from './components/DetalleContratoView';
import Icon from '../../common/icons/Icon';
import Toast from './components/Toast';

type View = 'dashboard' | 'contracts';

const App: React.FC = () => {
  const [contratos, setContratos] = useState<Contrato[]>(mockContratos);
  const [selectedContratoId, setSelectedContratoId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedContrato = useMemo(() => 
    contratos.find(c => c.id === selectedContratoId), 
    [contratos, selectedContratoId]
  );

  const handleSelectContrato = (id: string) => {
    setSelectedContratoId(id);
    setCurrentView('contracts');
  };

  const handleBackToList = () => {
    setSelectedContratoId(null);
  };
  
  const showToast = (message: string) => {
      setToastMessage(message);
  };

  const handleRegisterIncidence = useCallback((contratoId: string, hitoId: string, incidenciaData: { tipo: IncidenceType; descripcion: string }) => {
    setContratos(prevContratos => {
      return prevContratos.map(contrato => {
        if (contrato.id === contratoId) {
          const newIncidence = {
            id: `INC-${Date.now()}`,
            hitoId,
            ...incidenciaData,
            fechaDeteccion: new Date().toISOString(),
            status: IncidenceStatus.Abierta,
          };
          
          const updatedHitos = contrato.hitosDeEntrega.map(h => {
              if (h.id === hitoId && h.status !== MilestoneStatus.Atrasado && h.status !== MilestoneStatus.Incumplido) {
                  return {...h, status: MilestoneStatus.Incumplido}
              }
              return h;
          })

          return { ...contrato, incidencias: [...contrato.incidencias, newIncidence], hitosDeEntrega: updatedHitos };
        }
        return contrato;
      });
    });
    showToast("Incidencia registrada con éxito.");
  }, []);

  const handleApplyPenalty = useCallback((contratoId: string, incidenciaId: string, penalizacionData: Omit<Penalizacion, 'id'>) => {
    setContratos(prevContratos => {
      return prevContratos.map(contrato => {
        if (contrato.id === contratoId) {
          const updatedIncidencias = contrato.incidencias.map(incidencia => {
            if (incidencia.id === incidenciaId) {
              return {
                ...incidencia,
                status: IncidenceStatus.PenalizacionAplicada,
                penalizacion: { ...penalizacionData, id: `PEN-${Date.now()}` }
              };
            }
            return incidencia;
          });
          return { ...contrato, incidencias: updatedIncidencias, status: ContractStatus.ConPenalizacion };
        }
        return contrato;
      });
    });
    showToast(`Notificación enviada con éxito. Folio: ${penalizacionData.folio}`);
  }, []);

  const renderContent = () => {
    if (selectedContrato) {
      return <DetalleContratoView contrato={selectedContrato} onBack={handleBackToList} onRegisterIncidence={handleRegisterIncidence} onApplyPenalty={handleApplyPenalty} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardPrincipal contratos={contratos} onViewContrato={handleSelectContrato} />;
      case 'contracts':
        return <ListaContratos contratos={contratos} onSelectContrato={handleSelectContrato} />;
      default:
        return <DashboardPrincipal contratos={contratos} onViewContrato={handleSelectContrato}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-wider">PENALIZACIONES</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon={<Icon.Dashboard className="h-6 w-6"/>} label="Dashboard" active={currentView === 'dashboard' && !selectedContratoId} onClick={() => { setCurrentView('dashboard'); setSelectedContratoId(null); }} />
          <NavItem icon={<Icon.Contracts className="h-6 w-6"/>} label="Contratos" active={currentView === 'contracts' || !!selectedContratoId} onClick={() => { setCurrentView('contracts'); setSelectedContratoId(null); }} />
        </nav>
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
                <img src="https://picsum.photos/id/237/200/200" alt="User avatar" className="h-10 w-10 rounded-full"/>
                <div className="ml-3">
                    <p className="text-sm font-medium">Admin Contratos</p>
                    <p className="text-xs text-gray-400">Administrador</p>
                </div>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Icon.Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            active 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-4">{label}</span>
    </a>
);

export default App;