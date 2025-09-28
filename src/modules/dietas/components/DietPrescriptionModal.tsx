
import React, { useState, useEffect } from 'react';
import { Patient, Diet } from '../types';

interface DietPrescriptionModalProps {
  patient: Patient;
  diets: Diet[];
  onClose: () => void;
  onSave: (patientId: string, newDietId: string) => void;
}

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const DietPrescriptionModal: React.FC<DietPrescriptionModalProps> = ({ patient, diets, onClose, onSave }) => {
  const [selectedDietId, setSelectedDietId] = useState<string>(patient.activeDiet.dietId);
  const [conflict, setConflict] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const selectedDiet = diets.find(d => d.id === selectedDietId);
    if (!selectedDiet) return;

    // Check for allergy conflicts
    const allergyConflict = selectedDiet.allergens.find(allergen => patient.allergies.includes(allergen));
    if (allergyConflict) {
      setConflict(`Conflicto de Alergia: El paciente es alérgico a "${allergyConflict}" y esta dieta lo contiene.`);
      return;
    }

    // Check for medication conflicts
    const medicationConflict = selectedDiet.medicationConflicts.find(med => patient.medications.includes(med));
    if (medicationConflict) {
      setConflict(`Conflicto de Medicación: Esta dieta interactúa con "${medicationConflict}" que el paciente está tomando.`);
      return;
    }

    setConflict(null);
  }, [selectedDietId, patient, diets]);

  const handleSave = () => {
    if (conflict) return;
    setIsSaving(true);
    setTimeout(() => {
        onSave(patient.id, selectedDietId);
        onClose();
    }, 1000); // Simulate API call
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 animate-fade-in-up">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Prescripción de Dieta</h2>
          <p className="text-gray-600">para <span className="font-semibold text-blue-600">{patient.name}</span> ({patient.location})</p>
        </div>
        
        <div className="p-6">
          {patient.allergies.length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <h4 className="text-md font-bold text-red-700">Alergias Conocidas:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.allergies.map(allergy => (
                  <span key={allergy} className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full uppercase">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="diet-select" className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Dieta</label>
            <select
              id="diet-select"
              value={selectedDietId}
              onChange={(e) => setSelectedDietId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {diets.map(diet => (
                <option key={diet.id} value={diet.id}>{diet.name}</option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-500 min-h-[40px]">
            {diets.find(d => d.id === selectedDietId)?.description}
          </p>

          {conflict && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg animate-pulse">
              <p className="font-semibold"><AlertIcon /> Conflicto Detectado</p>
              <p className="text-sm">{conflict}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!!conflict || isSaving}
            className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 flex items-center justify-center min-w-[120px]
            ${conflict || isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}
            `}
          >
            {isSaving ? 
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 
                'Guardar Dieta'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DietPrescriptionModal;
