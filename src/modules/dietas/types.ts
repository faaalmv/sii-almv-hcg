
// Exportación directa de tipos e interfaces
export interface Diet {
  id: string;
  name: string;
  description: string;
  allergens: string[];
  medicationConflicts: string[];
}

export interface ActiveDiet {
  dietId: string;
  prescribedBy: string;
  alertsActive: string[];
}

export interface Patient {
  id: string;
  name: string;
  location: string;
  diagnosis: string;
  allergies: string[];
  medications: string[];
  activeDiet: ActiveDiet;
}

export interface Meal {
  id: string;
  name: string;
  dietTypes: string[];
}

export interface KitchenProduction {
  mealId: string;
  count: number;
}

// Usar as const con type para mantener compatibilidad con erasableSyntaxOnly
export const ComplianceStatus = {
  InRange: "IN_RANGE",
  OutOfRange: "OUT_OF_RANGE",
  ActionTaken: "ACTION_TAKEN",
} as const;

export type ComplianceStatus = typeof ComplianceStatus[keyof typeof ComplianceStatus];

export interface ComplianceLog {
  id: string;
  item: string;
  range: string;
  previousValue: number;
  currentValue: number | null;
  unit: string;
  status: ComplianceStatus;
  actionTaken?: string;
}
