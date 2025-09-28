export type Meal = 'desayuno' | 'comida' | 'cena';

export interface DailySchedule {
  [day: number]: {
    [key in Meal]: number;
  };
}

export interface Item {
  code: string;
  description: string;
  unit: string;
  dailyValues: number[];
  dailySchedule: DailySchedule;
  maxQuantity: number;
}

export interface Group {
  name: string;
  items: Item[];
}
