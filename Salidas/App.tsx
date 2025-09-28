import React, { useState } from 'react';
import Header from './components/Header';
import OrderTable from './components/OrderTable';
import Footer from './components/Footer';
import type { OrderItem } from './types';

const App: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: `item-${Date.now()}`,
      codigo: '',
      descripcion: '',
      um: '',
      cantidadPedida: '',
      cantidadSurtida: '',
      observaciones: '',
    },
  ]);
  const [folioData, setFolioData] = useState<{ number: number; timestamp: Date; } | null>(null);


  const updateItem = (id: string, updatedItem: Partial<OrderItem>) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: `item-${Date.now()}`,
        codigo: '',
        descripcion: '',
        um: '',
        cantidadPedida: '',
        cantidadSurtida: '',
        observaciones: '',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((item) => item.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegister = () => {
    const currentFolio = parseInt(localStorage.getItem('folioNumber') || '0', 10);
    const nextFolio = currentFolio + 1;
    localStorage.setItem('folioNumber', nextFolio.toString());

    const timestamp = new Date();
    
    setFolioData({
      number: nextFolio,
      timestamp: timestamp,
    });
    
    alert(`Pedido registrado con el folio: F.R.A. ${String(nextFolio).padStart(7, '0')}`);
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todo el pedido? Esta acción no se puede deshacer.')) {
        setOrderItems([
            {
                id: `item-${Date.now()}`,
                codigo: '',
                descripcion: '',
                um: '',
                cantidadPedida: '',
                cantidadSurtida: '',
                observaciones: '',
            },
        ]);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 p-4 sm:p-8 antialiased">
      
      <button
          onClick={handlePrint}
          className="fixed top-8 right-8 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 print:hidden z-50"
          title="Imprimir"
          aria-label="Imprimir pedido"
      >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v3h6v-3z" clipRule="evenodd" />
          </svg>
      </button>

      <button
          onClick={handleRegister}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 print:hidden z-50"
          title="Registrar"
          aria-label="Registrar pedido"
      >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.5 2.75A2.25 2.25 0 005.25 5v10A2.25 2.25 0 007.5 17.25h5A2.25 2.25 0 0014.75 15V7.121a2.25 2.25 0 00-.659-1.591l-1.621-1.621A2.25 2.25 0 0010.879 3.25H7.5zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zM8.25 12a.75.75 0 01.75-.75h2a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75z" />
          </svg>
      </button>
      
      <div className="max-w-7xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-xl print:shadow-none">
        <Header folioData={folioData} />
        <main>
          <OrderTable
            items={orderItems}
            updateItem={updateItem}
            removeItem={removeItem}
            addItem={addItem}
          />
           <div className="flex justify-start items-center gap-4 mt-6 print:hidden">
            <button
                onClick={addItem}
                className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Fila
            </button>
            <button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
                Limpiar Todo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;