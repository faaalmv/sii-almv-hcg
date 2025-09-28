
import React, { useState, useCallback, useMemo } from 'react';
import type { Patient, Diet, KitchenProduction } from './types';
import { PATIENTS, DIETS, MEALS, KITCHEN_DATA } from './constants';
import PatientDirectory from './components/PatientDirectory';
import DietPrescriptionModal from './components/DietPrescriptionModal';
import KitchenProductionDashboard from './components/KitchenProductionDashboard';
import ComplianceTracker from './components/ComplianceTracker';
import TrayLabel from './components/TrayLabel'; // For preview

type View = 'directory' | 'kitchen' | 'compliance';

const App: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>(PATIENTS);
    const [diets] = useState<Diet[]>(DIETS);
    const [kitchenData, setKitchenData] = useState<KitchenProduction[]>(KITCHEN_DATA);
    
    const [currentView, setCurrentView] = useState<View>('directory');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    const handleCloseModal = () => {
        setSelectedPatient(null);
    };

    const handleSaveDiet = useCallback((patientId: string, newDietId: string) => {
        let oldDietId: string | undefined;

        setPatients(prevPatients =>
            prevPatients.map(p => {
                if (p.id === patientId) {
                    oldDietId = p.activeDiet.dietId;
                    return { ...p, activeDiet: { ...p.activeDiet, dietId: newDietId } };
                }
                return p;
            })
        );
        
        // Simulate real-time update on kitchen dashboard
        if (oldDietId && oldDietId !== newDietId) {
            setKitchenData(prevData => {
                const newData = [...prevData];
                // Heuristic: Decrement a random meal from old diet, increment a random meal for new diet
                const oldMeal = MEALS.find(m => m.dietTypes.includes(oldDietId!));
                const newMeal = MEALS.find(m => m.dietTypes.includes(newDietId));

                if (oldMeal) {
                    const oldMealIndex = newData.findIndex(kd => kd.mealId === oldMeal.id);
                    if (oldMealIndex > -1 && newData[oldMealIndex].count > 0) {
                        newData[oldMealIndex] = { ...newData[oldMealIndex], count: newData[oldMealIndex].count - 1 };
                    }
                }
                if (newMeal) {
                    const newMealIndex = newData.findIndex(kd => kd.mealId === newMeal.id);
                     if (newMealIndex > -1) {
                        newData[newMealIndex] = { ...newData[newMealIndex], count: newData[newMealIndex].count + 1 };
                    }
                }
                return newData;
            });
        }
        
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);

    }, []);
    
    const renderView = () => {
        switch (currentView) {
            case 'directory':
                return <PatientDirectory patients={patients} diets={diets} onSelectPatient={handleSelectPatient} />;
            case 'kitchen':
                return <KitchenProductionDashboard meals={MEALS} productionData={kitchenData} />;
            case 'compliance':
                return <ComplianceTracker />;
            default:
                return <PatientDirectory patients={patients} diets={diets} onSelectPatient={handleSelectPatient} />;
        }
    };
    
    const selectedPatientDiet = useMemo(() => {
        if (!selectedPatient) return undefined;
        return diets.find(d => d.id === selectedPatient.activeDiet.dietId);
    }, [selectedPatient, diets]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-gray-800">
                            <span className="text-blue-600">Dietética</span>Digital
                        </div>
                        <div className="flex space-x-4">
                            {(['directory', 'kitchen', 'compliance'] as View[]).map(view => (
                                <button
                                    key={view}
                                    onClick={() => setCurrentView(view)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                        currentView === view
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-gray-600 hover:bg-blue-100'
                                    } active:scale-95`}
                                >
                                    {view === 'directory' ? 'Pacientes' : view === 'kitchen' ? 'Cocina' : 'Cumplimiento'}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto">
                {renderView()}
            </main>

            {selectedPatient && (
                <DietPrescriptionModal
                    patient={selectedPatient}
                    diets={diets}
                    onClose={handleCloseModal}
                    onSave={handleSaveDiet}
                />
            )}
            
            {showConfirmation && (
                <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-down">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Dieta actualizada con éxito.</span>
                </div>
            )}
            
            {/* Example Tray Label Preview - could be integrated elsewhere */}
            {/* {selectedPatient && selectedPatientDiet && <div className="fixed bottom-5 right-5 z-10"><TrayLabel patient={selectedPatient} diet={selectedPatientDiet} /></div>} */}

            <style>{`
              @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-down {
                animation: fade-in-down 0.5s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default App;
