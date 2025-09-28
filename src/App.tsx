import React, { useState, useMemo } from 'react';

// Importación de los Módulos de Aplicación (cada uno debe exportar su componente App)
import DietasApp from './modules/dietas/App';
import PagoProveedoresApp from './modules/pago-a-proveedores/App';
import PenalizacionesApp from './modules/penalizaciones/App';
import PncApp from './modules/pnc/App';
import ProgramacionMensualApp from './modules/programacion-mensual/App';
import SalidasApp from './modules/salidas/App';
// Importación del componente de Icono común
import Icon from './common/icons/Icon'; 

// Definición de las Rutas
const routes = {
    '/': { name: 'Home/Dashboard', component: () => <WelcomeMessage /> },
    '/dietas': { name: 'Módulo 🍽️ Dietas', component: DietasApp },
    '/pagoproveedores': { name: 'Módulo 💵 Pago Proveedores', component: PagoProveedoresApp },
    '/penalizaciones': { name: 'Módulo ⚖️ Penalizaciones', component: PenalizacionesApp },
    '/pnc': { name: 'Módulo 🚨 Prod. No Conf.', component: PncApp },
    '/programacion': { name: 'Módulo 🗓️ Programación Mensual', component: ProgramacionMensualApp },
    '/salidas': { name: 'Módulo 📦 Salidas/Pedidos', component: SalidasApp },
};

const WelcomeMessage: React.FC = () => (
    <div className="p-8 text-center bg-white rounded-lg shadow-xl">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4">SII-ALMV-HCG</h1>
        <p className="text-2xl text-gray-700">Plataforma Unificada del Almacén de Víveres</p>
        <p className="mt-8 text-lg text-gray-500">Bienvenido, Arquitecto. Utilice el menú lateral para acceder a la funcionalidad de cada módulo integrado.</p>
    </div>
);

// El Shell de la Aplicación (Manejo de Layout y Navegación)
const AppShell: React.FC = () => {
    // Usamos el estado para simular la navegación entre rutas sin usar react-router-dom aún.
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const CurrentComponent = useMemo(() => {
        const route = routes[currentPath as keyof typeof routes];
        return route ? route.component : routes['/']!.component;
    }, [currentPath]);
    
    // Función de navegación simple
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
                <div className="h-16 flex items-center justify-center border-b border-blue-700 bg-gray-800">
                    <h1 className="text-2xl font-black tracking-wider text-blue-400">SII-ALMV</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {Object.entries(routes).map(([path, { name }]) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`flex items-center px-4 py-3 rounded-xl text-md font-semibold transition-all w-full text-left
                                ${currentPath === path 
                                    ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                            }
                        >
                             {/* Nota: Aquí se usaría un componente Icon real, pero de momento es texto simple */}
                            {name}
                        </button>
                    ))}
                </nav>
                <div className="p-4 text-xs text-gray-500 border-t border-gray-700">
                    <p>Arquitectura: Monorepo F</p>
                    <p>Stack: React + Vite + TypeScript</p>
                </div>
            </aside>
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                 <CurrentComponent />
            </main>
        </div>
    );
};

export default AppShell;