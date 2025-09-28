import React, { useState } from 'react';
import { Factura, Usuario, RolUsuario, OrdenDeCompra } from './types';
import { MOCK_FACTURAS, MOCK_USUARIOS, MOCK_ORDENES_DE_COMPRA } from './constants';
import { PortalProveedor } from './components/PortalProveedor';
import { DashboardInterno } from './components/DashboardInterno';
import { LoginView } from './components/LoginView';
import Icon from '../../common/icons/Icon';
import Toast from '@/common/Toast';

const App: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>(MOCK_FACTURAS);
  const [ordenesDeCompra, setOrdenesDeCompra] = useState<OrdenDeCompra[]>(MOCK_ORDENES_DE_COMPRA);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
      setToastMessage(message);
  };

  const handleAddFactura = (newFacturaData: Omit<Factura, 'id' | 'proveedorId'>) => {
    if (!currentUser) return;
    const newFactura: Factura = {
        ...newFacturaData,
        id: `fac-${Date.now()}`,
        proveedorId: currentUser.id
    };
    setFacturas(prev => [newFactura, ...prev]);
  };

  const handleUpdateFactura = (updatedFactura: Factura) => {
    setFacturas(prev => prev.map(f => f.id === updatedFactura.id ? updatedFactura : f));
  };
  
  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setSearchQuery('');
  };

  const handleLinkOrdenDeCompra = (facturaId: string, ordenDeCompraId: string) => {
    const factura = facturas.find(f => f.id === facturaId);
    const ordenDeCompra = ordenesDeCompra.find(oc => oc.id === ordenDeCompraId);

    if (!factura || !ordenDeCompra) return;

    if (factura.ordenDeCompraId) {
        showToast('Esta factura ya está vinculada a una Orden de Compra.');
        return;
    }

    if (ordenDeCompra.montoTotal < ordenDeCompra.montoConsumido + factura.monto) {
        showToast('Error: El monto de la factura excede el saldo disponible de la Orden de Compra.');
        return;
    }

    const updatedFactura = { ...factura, ordenDeCompraId: ordenDeCompraId };
    setFacturas(prev => prev.map(f => f.id === facturaId ? updatedFactura : f));

    const updatedOC = {
        ...ordenDeCompra,
        montoConsumido: ordenDeCompra.montoConsumido + factura.monto,
        facturasVinculadasIds: [...ordenDeCompra.facturasVinculadasIds, factura.id]
    };
    setOrdenesDeCompra(prev => prev.map(oc => oc.id === ordenDeCompraId ? updatedOC : oc));
    showToast('Factura vinculada a la Orden de Compra con éxito.');
  };

  if (!currentUser) {
    return <LoginView users={MOCK_USUARIOS} onLogin={handleLogin} />;
  }
  
  const proveedorFacturas = facturas.filter(f => f.proveedorId === currentUser.id);
  const isAdmin = currentUser.rol !== RolUsuario.PROVEEDOR;

  return (
    <>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      <style>{`
          @keyframes app-fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-app-enter {
            animation: app-fade-in-up 0.5s ease-out forwards;
            opacity: 0;
          }
      `}</style>
      <div className="bg-slate-100 min-h-screen text-slate-800 animate-app-enter">
        <header className="bg-white shadow-md sticky top-0 z-40">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
                  </svg>
                  <h1 className="text-xl font-bold text-blue-900">Módulo de Pago a Proveedores</h1>
              </div>
              <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <div className="relative">
                       <Icon.MagnifyingGlass className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                       <input 
                         type="text"
                         placeholder="Buscar por folio, OC, proveedor..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-48 lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                    </div>
                  )}
                  <span className="text-sm text-gray-600 text-right hidden sm:block">
                      <span className="font-semibold block">{currentUser.nombre}</span>
                      <span className="text-xs">{currentUser.rol}</span>
                  </span>
                  <button 
                      onClick={handleLogout}
                      className="p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      aria-label="Cerrar sesión"
                  >
                      Salir
                  </button>
              </div>
          </nav>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-6 md:p-8 rounded-lg" style={{boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}}>
              {currentUser.rol === RolUsuario.PROVEEDOR ? (
                  <PortalProveedor 
                      facturas={proveedorFacturas} 
                      currentUser={currentUser}
                      onAddFactura={handleAddFactura}
                      ordenesDeCompra={ordenesDeCompra}
                      todasLasFacturas={facturas}
                      onLinkOrdenDeCompra={handleLinkOrdenDeCompra}
                  />
              ) : (
                  <DashboardInterno 
                      facturas={facturas} 
                      currentUser={currentUser}
                      onUpdateFactura={handleUpdateFactura}
                      ordenesDeCompra={ordenesDeCompra}
                      todasLasFacturas={facturas}
                      onLinkOrdenDeCompra={handleLinkOrdenDeCompra}
                      searchQuery={searchQuery}
                  />
              )}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
