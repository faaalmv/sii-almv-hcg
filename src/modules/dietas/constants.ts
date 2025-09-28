
import { Patient, Diet, Meal, KitchenProduction, ComplianceLog, ComplianceStatus } from './types';

export const DIETS: Diet[] = [
  { id: 'basal', name: 'Dieta Basal', description: 'Dieta normal sin restricciones.', allergens: [], medicationConflicts: [] },
  { id: 'hiposodica', name: 'Dieta Hiposódica', description: 'Baja en sodio para pacientes con hipertensión.', allergens: [], medicationConflicts: ['Captopril'] },
  { id: 'diabetes', name: 'Dieta para Diabetes', description: 'Control de carbohidratos para diabéticos.', allergens: [], medicationConflicts: [] },
  { id: 'blanda', name: 'Dieta Blanda', description: 'Alimentos de fácil digestión.', allergens: [], medicationConflicts: [] },
  { id: 'liquida', name: 'Dieta Líquida', description: 'Líquidos claros y completos.', allergens: ['lactosa'], medicationConflicts: [] },
  { id: 'sin-gluten', name: 'Dieta Sin Gluten', description: 'Excluye gluten para celíacos.', allergens: ['gluten'], medicationConflicts: [] },
  { id: 'alta-en-nueces', name: 'Dieta Alta en Nueces', description: 'Rica en frutos secos para aporte calórico.', allergens: ['nueces'], medicationConflicts: [] },
];

export const PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'Carlos Sánchez',
    location: 'Piso 4, Cama 402',
    diagnosis: 'Hipertensión Arterial',
    allergies: ['penicilina', 'nueces'],
    medications: ['Lisinopril'],
    activeDiet: { dietId: 'hiposodica', prescribedBy: 'Dr. López', alertsActive: [] },
  },
  {
    id: 'P002',
    name: 'Ana Gómez',
    location: 'Piso 4, Cama 405',
    diagnosis: 'Diabetes Mellitus Tipo 2',
    allergies: [],
    medications: ['Metformina'],
    activeDiet: { dietId: 'diabetes', prescribedBy: 'Dr. López', alertsActive: [] },
  },
  {
    id: 'P003',
    name: 'Luisa Fernández',
    location: 'Piso 5, Cama 501',
    diagnosis: 'Postoperatorio apendicectomía',
    allergies: ['lactosa'],
    medications: ['Paracetamol'],
    activeDiet: { dietId: 'blanda', prescribedBy: 'Dr. Martínez', alertsActive: ['interaccion-farmaco'] },
  },
  {
    id: 'P004',
    name: 'Javier Torres',
    location: 'Piso 5, Cama 503',
    diagnosis: 'Recuperación',
    allergies: [],
    medications: [],
    activeDiet: { dietId: 'basal', prescribedBy: 'Dra. Ramos', alertsActive: [] },
  },
];

export const MEALS: Meal[] = [
    { id: 'M01', name: 'Pollo a la Plancha', dietTypes: ['basal', 'hiposodica', 'diabetes', 'blanda'] },
    { id: 'M02', name: 'Sopa de Verduras', dietTypes: ['basal', 'hiposodica', 'diabetes', 'blanda', 'liquida'] },
    { id: 'M03', name: 'Puré de Patatas', dietTypes: ['blanda', 'liquida'] },
    { id: 'M04', name: 'Pescado al Vapor', dietTypes: ['basal', 'hiposodica', 'diabetes'] },
    { id: 'M05', name: 'Ensalada de Quinoa', dietTypes: ['basal', 'diabetes', 'sin-gluten'] },
    { id: 'M06', name: 'Yogurt Natural', dietTypes: ['basal', 'blanda'] },
];

export const KITCHEN_DATA: KitchenProduction[] = [
    { mealId: 'M01', count: 45 },
    { mealId: 'M02', count: 62 },
    { mealId: 'M03', count: 30 },
    { mealId: 'M04', count: 38 },
    { mealId: 'M05', count: 25 },
    { mealId: 'M06', count: 50 },
];

export const COMPLIANCE_DATA: ComplianceLog[] = [
    { id: 'C01', item: 'Refrigerador #1 Lácteos', range: '< 4°C', previousValue: 3.5, currentValue: null, unit: '°C', status: ComplianceStatus.InRange },
    { id: 'C02', item: 'Refrigerador #2 Carnes', range: '< 4°C', previousValue: 4.8, currentValue: null, unit: '°C', status: ComplianceStatus.OutOfRange },
    { id: 'C03', item: 'Congelador #1', range: '< -18°C', previousValue: -20, currentValue: null, unit: '°C', status: ComplianceStatus.InRange },
];
