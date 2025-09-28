
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

export enum ComplianceStatus {
  InRange = "IN_RANGE",
  OutOfRange = "OUT_OF_RANGE",
  ActionTaken = "ACTION_TAKEN",
}

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
