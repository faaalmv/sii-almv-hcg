
import React from 'react';
import { type Meal, type KitchenProduction } from '../types';
import ProductionCard from './ProductionCard';

interface KitchenProductionDashboardProps {
  meals: Meal[];
  productionData: KitchenProduction[];
}

const KitchenProductionDashboard: React.FC<KitchenProductionDashboardProps> = ({ meals, productionData }) => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Producción de Cocina</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {productionData.map(item => {
          const meal = meals.find(m => m.id === item.mealId);
          return meal ? (
            <ProductionCard key={item.mealId} meal={meal} count={item.count} />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default KitchenProductionDashboard;
