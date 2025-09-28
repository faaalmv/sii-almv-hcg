import React, { useState } from 'react';
import { entregadoPorData, recibidoPorData } from '../data/personnel';
import type { Personnel } from '../data/personnel';

const SignatureBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="h-40 flex flex-col p-4 bg-white rounded-xl shadow-lg border border-gray-200/80">
        <h4 className="font-bold text-xs text-center text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">{title}</h4>
        <div className="flex-grow flex flex-col justify-between items-center text-center text-sm pt-2">
            {children}
        </div>
    </div>
);


const SelectableSignatureBox: React.FC<{ title: string; nameLabel: string; personnelList: Personnel[] }> = ({ title, nameLabel, personnelList }) => {
    const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
    const [isEditing, setIsEditing] = useState(true);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const rud = e.target.value;
        const person = personnelList.find(p => p.rud === rud) || null;
        setSelectedPerson(person);
        if (person) {
            setIsEditing(false);
        }
    };
    
    const content = isEditing || !selectedPerson ? (
        <>
            <div className="flex-grow flex flex-col justify-center items-center w-full">
                <select
                    value={selectedPerson?.rud || ''}
                    onChange={handleSelectChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-xs text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    <option value="" disabled={selectedPerson !== null}>Seleccione firmante...</option>
                    {personnelList.map((person) => (
                        <option key={person.rud} value={person.rud}>
                            {person.name}
                        </option>
                    ))}
                </select>
            </div>
            <p className="font-semibold text-xs text-gray-400">{nameLabel}</p>
        </>
    ) : (
        <>
            <div className="flex-grow flex flex-col justify-center items-center w-full cursor-pointer" onClick={() => setIsEditing(true)} title="Haga clic para cambiar">
                <p className="font-bold leading-tight text-blue-700">{selectedPerson.name}</p>
                <p className="text-blue-600 text-xs font-mono">{selectedPerson.rud}</p>
            </div>
            <p className="font-semibold text-xs text-gray-400">{nameLabel}</p>
        </>
    );

    return <SignatureBox title={title}>{content}</SignatureBox>;
};


const Footer: React.FC = () => {
    return (
        <footer className="mt-12 print:mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <SignatureBox title="Jefe de Servicio Dietología">
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <p className="font-semibold leading-tight text-gray-800">KARLA MABEL GUTIERREZ VELASCO</p>
                        <p className="text-gray-500 text-xs font-mono">2000060</p>
                    </div>
                    <p className="font-semibold text-xs text-gray-400">NOMBRE Y FIRMA</p>
                </SignatureBox>
                <SignatureBox title="Almacén de Víveres">
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <p className="font-semibold leading-tight text-gray-800">OSCAR BECERRA GONZALEZ</p>
                        <p className="text-gray-500 text-xs font-mono">980933</p>
                    </div>
                    <p className="font-semibold text-xs text-gray-400">NOMBRE Y FIRMA</p>
                </SignatureBox>
                 <SelectableSignatureBox
                    title="Entregado Por"
                    nameLabel="NOMBRE Y RUD"
                    personnelList={entregadoPorData}
                />
                <SelectableSignatureBox
                    title="Recibido Por"
                    nameLabel="NOMBRE Y RUD"
                    personnelList={recibidoPorData}
                />
            </div>
        </footer>
    );
};

export default Footer;