import React, { useMemo, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { OrderItem, ItemData } from '../types';
import { itemsData } from '../data/items';
import { convertNumberToWords } from '../../../common/utils/numberToWords';
import Modal from '../../../common/Modal';

interface OrderTableRowProps {
  item: OrderItem;
  updateItem: (id: string, updatedItem: Partial<OrderItem>) => void;
  removeItem: (id: string) => void;
  addItem: () => void;
}

const predefinedReasons = [
    'Entrega parcial del proveedor.',
    'Devolución del Almacén por incumplimiento en calidad.',
    'Devolución de Dietología por incumplimiento en calidad.',
    'Otro',
];

const preventNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and arrows
    const isControlKey = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ].includes(e.key);

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Command+A (for copy/paste/select all)
    const isCopyPaste = (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) && (e.ctrlKey || e.metaKey);
    
    // Allow: home, end keys
    const isNavigationKey = ['Home', 'End'].includes(e.key);

    // If it's not a digit and not an allowed control/navigation key, prevent default
    if (!/^[0-9]$/.test(e.key) && !isControlKey && !isCopyPaste && !isNavigationKey) {
        e.preventDefault();
    }
};


const OrderTableRow: React.FC<OrderTableRowProps> = ({ item, updateItem, removeItem, addItem }) => {
    
    const [showMaxTooltip, setShowMaxTooltip] = useState(false);
    const [inputValue, setInputValue] = useState(item.descripcion);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [quantityError, setQuantityError] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const cellRef = useRef<HTMLTableCellElement>(null);

    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherReasonText, setOtherReasonText] = useState('');

    useEffect(() => {
        setInputValue(item.descripcion);
    }, [item.descripcion]);

    const sortedItems = useMemo(() =>
        [...itemsData].sort((a, b) => a.descripcion.localeCompare(b.descripcion)), 
    []);

    const filteredItems = useMemo(() =>
        sortedItems.filter(d =>
            d.descripcion.toLowerCase().includes((inputValue || '').toLowerCase())
        ),
        [inputValue, sortedItems]
    );

    const selectedItemData = useMemo(() =>
        itemsData.find(d => d.codigo.toString() === item.codigo),
        [item.codigo]
    );
    const maxQuantity = selectedItemData?.maximo;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value === '') {
            updateItem(item.id, {
                codigo: '',
                descripcion: '',
                um: '', // @ts-ignore
                cantidadPedida: '', // @ts-ignore
                cantidadSurtida: '', // @ts-ignore
                observaciones: '',
            });
        }
    };

    const handleItemSelect = (selectedItem: ItemData) => {
        setIsDropdownVisible(false);
        updateItem(item.id, {
            codigo: selectedItem.codigo.toString(),
            descripcion: selectedItem.descripcion,
            um: selectedItem.um,
            cantidadPedida: 0, // Reset quantities on new item selection
            cantidadSurtida: 0,
            observaciones: '',
        });
    };
    
    const handleInputFocus = () => {
        setIsDropdownVisible(true);
    };
    
    const handleInputBlur = () => {
        setTimeout(() => {
            setIsDropdownVisible(false);
            setInputValue(item.descripcion);
        }, 150);
    };

    const handleCantidadPedidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Sanitize
        if (quantityError) setQuantityError('');
        
        if (value === '') {
            updateItem(item.id, { cantidadPedida: 0 });
            return;
        }
    
        const numericValue = parseInt(value, 10);
    
        if (numericValue <= 0) {
            updateItem(item.id, { cantidadPedida: 0 }); // Clear if 0 or less
            return;
        }
        
        let finalValue = value;
        if (!isNaN(numericValue) && maxQuantity !== undefined) {
            if (numericValue > maxQuantity) {
                setQuantityError(`Excede máximo: ${maxQuantity}`);
                setTimeout(() => setQuantityError(''), 3000);
                finalValue = maxQuantity.toString();
            }
        }
        
        updateItem(item.id, { cantidadPedida: Number(finalValue) });
    };

    const handleCantidadSurtidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Sanitize
        const cantidadPedida = item.cantidadPedida || 0;
    
        if (value === '') {
            updateItem(item.id, { cantidadSurtida: 0, observaciones: '' });
            return;
        }
    
        let finalValue = value;
        const numericValue = parseInt(finalValue, 10);
    
        if (!isNaN(numericValue) && numericValue > cantidadPedida) {
            alert('La cantidad surtida no puede ser mayor a la cantidad pedida.');
            finalValue = cantidadPedida.toString();
        }
        
        const finalNumericValue = parseInt(finalValue, 10);
        const words = isNaN(finalNumericValue) ? '' : convertNumberToWords(finalNumericValue);
        updateItem(item.id, {
            cantidadSurtida: Number(finalValue),
            observaciones: words,
        });
    };
    

    const handleCantidadSurtidaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        preventNonNumericKeys(e);
        if (e.key !== 'Enter') return;

        e.preventDefault();

        const surtida = item.cantidadSurtida;
        const pedida = item.cantidadPedida;

        if (!surtida || !pedida) {
            return;
        }

        if (surtida < pedida) {
            setSelectedReason(null);
            setOtherReasonText('');
            setIsReasonModalOpen(true);
        } else {
            addItem();
            setTimeout(() => {
                const allDescriptionInputs = document.querySelectorAll<HTMLInputElement>('input[placeholder="Buscar artículo..."]');
                if (allDescriptionInputs.length > 0) {
                    const lastInput = allDescriptionInputs[allDescriptionInputs.length - 1];
                    lastInput.focus();
                }
            }, 50);
        }
    };

    const handleSaveReason = () => {
        const finalReason = selectedReason === 'Otro' ? otherReasonText : selectedReason;

        console.log('Motivo de entrega parcial:', {
            codigo: item.codigo,
            descripcion: item.descripcion,
            cantidadPedida: item.cantidadPedida,
            cantidadSurtida: item.cantidadSurtida,
            motivo: finalReason,
        });
        setIsReasonModalOpen(false);
    };

    const handleCancelReason = () => {
        setIsReasonModalOpen(false);
    };

    const handleGenericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateItem(item.id, { [e.target.name]: e.target.value });
    };

    const handleCantidadPedidaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        preventNonNumericKeys(e);
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentRow = e.currentTarget.closest('tr');
            if (currentRow) {
                const nextInput = currentRow.querySelector<HTMLInputElement>('input[name="cantidadSurtida"]');
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    const handleRemoveItem = () => {
        const hasData = item.codigo || item.cantidadPedida > 0 || item.cantidadSurtida > 0 || item.observaciones;
        if (hasData) {
            if (window.confirm('¿Estás seguro que deseas eliminar esta fila?')) {
                removeItem(item.id);
            }
        } else {
            removeItem(item.id);
        }
    };
    
    const isSaveDisabled = !selectedReason || (selectedReason === 'Otro' && !otherReasonText.trim());
    
    const dropdownMenu = isDropdownVisible && (
        <div ref={cellRef} className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
                {filteredItems.length > 0 ? (
                    filteredItems.map(dataItem => (
                        <li
                            key={dataItem.codigo}
                            onMouseDown={() => handleItemSelect(dataItem)}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm whitespace-normal"
                        >
                            {dataItem.descripcion}
                        </li>
                    ))
                ) : (
                    <li className="px-3 py-2 text-gray-500 text-sm">No se encontraron artículos</li>
                )}
            </ul>
        </div>
    );




  return (
    <>
        <tr className="group hover:bg-blue-50/75 transition-colors duration-150">
        <td className="px-4 py-2 text-center align-middle whitespace-nowrap text-gray-700 font-mono border-r border-gray-200">{item.codigo}</td>
        <td ref={cellRef} className="align-middle relative border-r border-gray-200">
            <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full h-full border-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rounded-md bg-transparent text-sm p-3"
            placeholder="Buscar artículo..."
            autoComplete="off"
            /> {isDropdownVisible && <div className="absolute top-full left-0 w-full z-50">
                {dropdownMenu}
            </div>}
            {dropdownMenu}
        </td>
        <td className="px-4 py-2 text-center align-middle whitespace-nowrap text-gray-600 border-r border-gray-200">{item.um}</td>
        <td className="align-middle relative border-r border-gray-200">
            {item.codigo && showMaxTooltip && maxQuantity !== undefined && !quantityError && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 shadow-lg">
                    Máximo: {maxQuantity}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                </div>
            )}
            {quantityError && (
                <div role="alert" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-red-600 text-white text-xs rounded py-1 px-3 z-10 shadow-lg font-semibold">
                    {quantityError}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-red-600"></div>
                </div>
            )}
            <input
            type="text"
            pattern="\d*"
            name="cantidadPedida"
            value={item.cantidadPedida}
            onChange={handleCantidadPedidaChange}
            onKeyDown={handleCantidadPedidaKeyDown}
            onFocus={() => setShowMaxTooltip(true)}
            onBlur={() => setShowMaxTooltip(false)}
            className="w-full h-full border-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rounded-md text-center bg-transparent p-3"
            disabled={!item.codigo}
            min="1"
            />
        </td>
        <td className="align-middle border-r border-gray-200">
            <input
            type="text"
            pattern="\d*"
            name="cantidadSurtida"
            value={item.cantidadSurtida}
            onChange={handleCantidadSurtidaChange}
            onKeyDown={handleCantidadSurtidaKeyDown}
            className="w-full h-full border-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rounded-md text-center bg-transparent p-3"
            disabled={!item.cantidadPedida}
            />
        </td>
        <td className="align-middle border-r border-gray-200">
            <input
            type="text"
            name="observaciones"
            value={item.observaciones}
            onChange={handleGenericChange}
            className="w-full h-full border-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rounded-md px-3 bg-transparent p-3"
            />
        </td>
        <td className="px-4 text-center align-middle print:hidden">
            <button onClick={handleRemoveItem} className="text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100" aria-label="Eliminar fila">
            <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="http://www.w3.org/2000/svg" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            </button>
        </td>
        </tr>
        <Modal 
            isOpen={isReasonModalOpen} 
            onClose={handleCancelReason} 
            title="EXPLICAR MOTIVO DE ENTREGA PARCIAL"
            isDismissable={false}
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-amber-900">
                        La cantidad surtida (<strong className="font-semibold">{item.cantidadSurtida}</strong>) es menor a la pedida (<strong className="font-semibold">{item.cantidadPedida}</strong>). Por favor, seleccione un motivo.
                    </p>
                </div>
                
                <fieldset className="space-y-3">
                    <legend className="sr-only">Motivos</legend>
                    {predefinedReasons.map((reasonText) => (
                        <div key={reasonText}>
                            <input
                                type="radio"
                                id={reasonText}
                                name="reason"
                                value={reasonText}
                                checked={selectedReason === reasonText}
                                onChange={() => setSelectedReason(reasonText)}
                                className="sr-only peer"
                            />
                            <label 
                                htmlFor={reasonText} 
                                className="relative flex items-center justify-between w-full p-4 text-gray-700 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 hover:border-slate-300 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 peer-checked:text-blue-800 peer-checked:bg-blue-50"
                            >
                                <span className="font-medium text-sm">{reasonText}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 text-blue-600 hidden peer-checked:block transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </label>
                        </div>
                    ))}
                </fieldset>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${selectedReason === 'Otro' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <textarea
                        value={otherReasonText}
                        onChange={(e) => setOtherReasonText(e.target.value)}
                        className="w-full h-24 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                        placeholder="Especifique el motivo..."
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={handleCancelReason}
                    type="button"
                    className="py-2.5 px-6 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSaveReason}
                    type="button"
                    disabled={isSaveDisabled}
                    className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:from-gray-400 disabled:to-gray-400"
                >
                    Guardar Motivo
                </button>
            </div>
        </Modal>
    </>
  );
};

export default OrderTableRow;