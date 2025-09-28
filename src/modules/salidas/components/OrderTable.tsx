import React from 'react';
import OrderTableRow from './OrderTableRow';
import type { OrderItem } from '../types';

interface OrderTableProps {
  items: OrderItem[];
  updateItem: (id: string, updatedItem: Partial<OrderItem>) => void;
  removeItem: (id: string) => void;
  addItem: () => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ items, updateItem, removeItem, addItem }) => {
  return (
    <div className="mt-6 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-sm">
            <tr className="border-b-2 border-gray-300">
              <th scope="col" className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider w-[10%] border-r border-gray-200">Codigo</th>
              <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider w-[35%] border-r border-gray-200">Descripción del Artículo</th>
              <th scope="col" className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider w-[10%] border-r border-gray-200">Unidad de Medida</th>
              <th scope="col" className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider w-[10%] border-r border-gray-200">Cantidad Pedida</th>
              <th scope="col" className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider w-[10%] border-r border-gray-200">Cantidad Surtida</th>
              <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider w-[20%] border-r border-gray-200">Observaciones</th>
              <th scope="col" className="px-4 py-3 print:hidden w-[5%]"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <OrderTableRow
                key={item.id}
                item={item}
                updateItem={updateItem}
                removeItem={removeItem}
                addItem={addItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;