import React, { useState } from 'react';
import FolioStamp from './FolioStamp';

interface HeaderProps {
    folioData: { number: number; timestamp: Date } | null;
}

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-1 h-full">
        <label className="font-medium text-gray-500 text-xs">{label}</label>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-sm text-gray-800 flex-grow flex items-center">
            {children}
        </div>
    </div>
);

const Header: React.FC<HeaderProps> = ({ folioData }) => {
    const [currentDate, setCurrentDate] = useState('');
    
    const services = [
        "PACIENTES",
        "PACIENTES JORNADA",
        "COMEDOR",
        "COMEDOR JORNADA",
        "NUTRICIÓN CLÍNICA",
        "BANCO DE LECHE",
        "BANCO DE SANGRE",
        "DIETOLOGIA 1",
        "DIETOLOGIA 2",
        "DIETOLOGIA 5",
        "DIETOLOGIA 8",
        "DIETOLOGIA 10",
    ];
    const [selectedService, setSelectedService] = useState(''); // Default to empty

    const logoUrl = 'https://www.hcg.gob.mx/hcg/sites/hcgtransparencia.dd/files/styles/boletines_galeria_eventos/public/imgEventosCS/Logotipo%20HCG_9.jpg?itok=lpEFOrvM';

    return (
        <header className="mb-8 relative">
            {folioData && <FolioStamp number={folioData.number} timestamp={folioData.timestamp} />}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border-b pb-6 mb-6 border-gray-200">
                <img src={logoUrl} alt="Logo Hospital Civil de Guadalajara" className="h-20 w-auto" />
                <div className="text-center sm:text-left flex-grow">
                    <h1 className="font-bold text-xl text-gray-800">HOSPITAL CIVIL DE GUADALAJARA</h1>
                    <h2 className="font-semibold text-lg text-blue-600">PEDIDO AL ALMACEN</h2>
                    <h3 className="text-md text-gray-500">VÍVERES</h3>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end items-end gap-6">
                <div className="w-full sm:w-48">
                    <FormField label="Fecha">
                        <input 
                            type="date" 
                            value={currentDate} 
                            onChange={(e) => setCurrentDate(e.target.value)}
                            className="bg-transparent outline-none w-full" 
                            aria-label="Fecha del pedido"
                        />
                    </FormField>
                </div>
                <div className="w-full sm:w-72">
                    <FormField label="Servicio">
                        <select 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="bg-transparent outline-none w-full appearance-none" 
                          aria-label="Servicio"
                        >
                           <option value="" disabled>Seleccione un servicio...</option>
                           {services.map(service => (
                                <option key={service} value={service}>{service}</option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </div>
        </header>
    );
};

export default Header;