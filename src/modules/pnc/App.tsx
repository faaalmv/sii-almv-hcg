import React, { useState, useMemo } from 'react';
import type { ChangeEvent, FC } from 'react';
import { FormData, ActionItem } from './types';
import Logo from './components/Logo';
import { purchaseOrdersData } from './data';
import { normasData } from './normas';
import SignaturePad from './components/SignaturePad';

const initialActions: ActionItem[] = [
  { descripcion: '', responsable: '', fechaCompromiso: '', fechaCierre: '' },
  { descripcion: '', responsable: '', fechaCompromiso: '', fechaCierre: '' },
  { descripcion: '', responsable: '', fechaCompromiso: '', fechaCierre: '' },
];

const generateNewFolio = (): string => {
  const year = new Date().getFullYear();
  const storageKey = 'folioCounter';
  let counterData: { [key: number]: number } = {};

  try {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      counterData = JSON.parse(storedData);
    }
  } catch (error) {
    console.error("No se pudo analizar el contador de folios desde localStorage", error);
    counterData = {};
  }
  
  const currentCount = counterData[year] || 0;
  const newCount = currentCount + 1;
  counterData[year] = newCount;

  try {
    localStorage.setItem(storageKey, JSON.stringify(counterData));
  } catch (error) {
    console.error("No se pudo guardar el contador de folios en localStorage", error);
  }

  return `PNC-${newCount}-${year}`;
};


const initialState: FormData = {
  folio: generateNewFolio(),
  fecha: new Date().toISOString().split('T')[0],
  ordenDeCompra: '',
  proceso: '',
  proveedor: '',
  codigo: '',
  descripcion: '',
  cantidad: '',
  fechaCaducidad: '',
  lote: '',
  marca: '',
  fundamento: '',
  observacion: '',
  evidenciaObjetiva: '',
  origen: '',
  accionTomada: '',
  identificacionProducto: '',
  ubicacionAislamiento: '',
  accionesInmediatas: '',
  realizada: '',
  fechaEvaluacion: '',
  resultadosEvaluacion: '',
  accionSeleccionada: '',
  justificacionDecision: '',
  autorizadoPor: '',
  fechaAutorizacion: '',
  acciones: initialActions,
  detectoFirma: '',
  proveedorFirma: '',
  dietologiaFirma: '',
};

type CriterioOption = {
  id: string;
  label: string;
  numeral: string;
  principio: string;
};

const SectionHeader: FC<{ title: string; className?: string }> = ({ title, className }) => (
    <div className={`col-span-12 mt-4 bg-slate-700 text-white p-2 text-base font-bold rounded-t-md ${className}`}>
      {title}
    </div>
);

const App: FC = () => {
  const [formData, setFormData] = useState<FormData>(() => initialState);
  const [isPerishable, setIsPerishable] = useState(false);
  const [selectedNorma, setSelectedNorma] = useState('');
  
  const origenOptions = ['Interno', 'Proveedor', 'Auditoría Externa', 'Cliente'];
  const accionOptions = ['Rechazo del producto', 'Reprocesar', 'Aceptar con concesión', 'Desechar'];
  
  const procesos = useMemo(() => {
    const allProcesos = Object.values(purchaseOrdersData).map(d => d.proceso_licitacion.trim());
    return [...new Set(allProcesos)];
  }, []);

  const proveedores = useMemo(() => {
      if (!formData.proceso) return [];
      const filtered = Object.values(purchaseOrdersData).filter(d => d.proceso_licitacion.trim() === formData.proceso);
      const allProveedores = filtered.map(p => p.proveedor.trim());
      return [...new Set(allProveedores)];
  }, [formData.proceso]);

  const ordenesDeCompra = useMemo(() => {
      if (!formData.proceso || !formData.proveedor) return [];
      return Object.keys(purchaseOrdersData).filter(key => {
          const d = purchaseOrdersData[key];
          return d.proceso_licitacion.trim() === formData.proceso && d.proveedor.trim() === formData.proveedor;
      });
  }, [formData.proceso, formData.proveedor]);

  const articulos = useMemo(() => {
    if (!formData.ordenDeCompra) return [];
    return purchaseOrdersData[formData.ordenDeCompra]?.articulos ?? [];
  }, [formData.ordenDeCompra]);

  const criteriosDeRechazo = useMemo((): CriterioOption[] => {
    if (!selectedNorma || !normasData[selectedNorma]) return [];
    
    const norma = normasData[selectedNorma];
    let criterios: CriterioOption[] = [];

    if (norma.norma.startsWith('NOM-051')) {
      criterios = norma.principios_normativos.criterios_de_rechazo?.map((c, i) => ({
        id: `nom051-${i}`,
        label: `Numeral ${c.numeral}: ${c.principio.substring(0, 80)}...`,
        numeral: c.numeral,
        principio: c.principio,
      })) ?? [];
    } else if (norma.norma.startsWith('NOM-251')) {
      const generales = norma.principios_normativos.criterios_generales?.map((c, i) => ({
        id: `nom251-gen-${i}`,
        label: `General ${c.numeral}: ${c.principio.substring(0, 80)}...`,
        numeral: c.numeral,
        principio: c.principio,
      })) ?? [];
      
      const porCategoria = norma.principios_normativos.criterios_por_categoria?.flatMap(cat => 
        cat.parametros.filter(p => p.rechazo !== 'N/A').map((p, i) => ({
          id: `nom251-cat-${cat.categoria}-${i}`,
          label: `${cat.categoria} - ${p.parametro}: ${p.rechazo.substring(0, 60)}...`,
          numeral: `Tabla 1 - ${cat.categoria}`,
          principio: `${p.parametro}: ${p.rechazo}`,
        }))
      ) ?? [];
      criterios = [...generales, ...porCategoria];
    }
    return criterios;
  }, [selectedNorma]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
        const newState: FormData = { ...prev, [name]: value };
        
        if (name === 'proceso') {
            newState.proveedor = '';
            newState.ordenDeCompra = '';
            newState.descripcion = '';
            newState.codigo = '';
        } else if (name === 'proveedor') {
            newState.ordenDeCompra = '';
            newState.descripcion = '';
            newState.codigo = '';
        } else if (name === 'ordenDeCompra') {
            newState.descripcion = '';
            newState.codigo = '';
        } else if (name === 'descripcion') {
            const selectedArticle = articulos.find(a => a.descripcion_articulo === value);
            newState.codigo = selectedArticle ? String(selectedArticle.codigo) : '';
        }
        
        return newState;
    });
  };

   const handleNormaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const norma = e.target.value;
    setSelectedNorma(norma);
    setFormData(prev => ({
      ...prev,
      fundamento: '',
    }));
  };

  const handleCriterioChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const criterioId = e.target.value;
    const criterio = criteriosDeRechazo.find(c => c.id === criterioId);
    if (criterio) {
      setFormData(prev => ({
        ...prev,
        fundamento: `Referencia: ${selectedNorma}, Numeral ${criterio.numeral}.\n\n${criterio.principio}`,
      }));
    }
  };

  const handleActionChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newActions = [...formData.acciones];
    (newActions[index] as any)[name] = value;
    setFormData(prev => ({ ...prev, acciones: newActions }));
  };

  const handleSignatureChange = (field: keyof FormData, dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: dataUrl,
    }));
  };

  const handlePerishableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsPerishable(checked);
    setFormData(prev => ({
        ...prev,
        fechaCaducidad: checked ? 'N/A' : '',
        lote: checked ? 'N/A' : '',
        marca: checked ? 'N/A' : '',
    }));
  };

  const handlePrint = () => {
    window.print();
  };
  
  const inputClasses = "w-full p-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
  const readonlyInputClasses = `${inputClasses} bg-gray-200 cursor-not-allowed`;
  const textareaClasses = `${inputClasses} resize-none`;
  const selectClasses = `${inputClasses} appearance-none disabled:bg-gray-200 disabled:cursor-not-allowed`;
  const fieldWrapperClasses = "flex flex-col space-y-1";
  const labelClasses = "text-xs font-semibold text-gray-600 uppercase tracking-wider";


  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl h-[95vh] bg-white p-6 shadow-2xl printable-area border border-gray-300 rounded-lg flex flex-col">
        
        <header className="flex justify-between items-center mb-4 pb-4 border-b-2 border-slate-800">
          <div className="w-1/4">
            <Logo />
          </div>
          <div className="w-1/2 text-center">
            <h1 className="text-2xl font-bold text-slate-800">CONTROL DE PRODUCTO NO CONFORME</h1>
            <h2 className="text-lg text-slate-700">Almacén de Víveres</h2>
          </div>
          <div className="w-1/4 flex flex-col items-end space-y-2">
             <div className="flex items-center w-full max-w-xs">
                <label className="font-bold text-sm text-right pr-2 flex-1 text-slate-600">Folio:</label>
                <input type="text" name="folio" value={formData.folio} className="p-2 text-sm w-40 bg-slate-200 border border-slate-300 rounded-md cursor-not-allowed" readOnly/>
             </div>
             <div className="flex items-center w-full max-w-xs">
                <label className="font-bold text-sm text-right pr-2 flex-1 text-slate-600">Fecha:</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="p-2 text-sm w-40 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
             </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                
                <div className="col-span-12 lg:col-span-6">
                    <SectionHeader title="1. DATOS GENERALES" className="!mt-0" />
                    <div className="grid grid-cols-2 gap-4 p-3 bg-white border border-t-0 border-gray-200 rounded-b-md">
                        <div className={fieldWrapperClasses}>
                            <label className={labelClasses}>Proceso</label>
                            <select name="proceso" value={formData.proceso} onChange={handleChange} className={selectClasses}>
                                <option value="" disabled>Seleccionar Proceso...</option>
                                {procesos.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className={fieldWrapperClasses}>
                            <label className={labelClasses}>Proveedor</label>
                            <select name="proveedor" value={formData.proveedor} onChange={handleChange} className={selectClasses} disabled={!formData.proceso}>
                                <option value="" disabled>Seleccionar Proveedor...</option>
                                {proveedores.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className={`${fieldWrapperClasses} col-span-2`}>
                            <label className={labelClasses}>Orden de Compra</label>
                            <select name="ordenDeCompra" value={formData.ordenDeCompra} onChange={handleChange} className={selectClasses} disabled={!formData.proveedor}>
                                <option value="" disabled>Seleccionar Orden de Compra...</option>
                                {ordenesDeCompra.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="col-span-12 lg:col-span-6">
                    <SectionHeader title="2. IDENTIFICACIÓN DEL PRODUCTO" className="!mt-0" />
                    <div className="grid grid-cols-3 gap-4 p-3 bg-white border border-t-0 border-gray-200 rounded-b-md">
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Código</label>
                           <input type="text" name="codigo" value={formData.codigo} className={readonlyInputClasses} readOnly />
                         </div>
                         <div className={`${fieldWrapperClasses} col-span-2`}>
                           <label className={labelClasses}>Descripción</label>
                            <select name="descripcion" value={formData.descripcion} onChange={handleChange} className={selectClasses} disabled={!formData.ordenDeCompra}>
                                <option value="" disabled>Seleccionar Artículo...</option>
                                {articulos.map(item => (
                                    <option key={item.codigo} value={item.descripcion_articulo}>{item.descripcion_articulo}</option>
                                ))}
                            </select>
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Cantidad</label>
                           <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} className={inputClasses} />
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Fecha de Caducidad</label>
                           <input type={isPerishable ? 'text' : 'date'} name="fechaCaducidad" value={formData.fechaCaducidad} onChange={handleChange} className={isPerishable ? readonlyInputClasses : inputClasses} disabled={isPerishable} />
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Lote</label>
                           <input type="text" name="lote" value={formData.lote} onChange={handleChange} className={isPerishable ? readonlyInputClasses : inputClasses} disabled={isPerishable}/>
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Marca</label>
                           <input type="text" name="marca" value={formData.marca} onChange={handleChange} className={isPerishable ? readonlyInputClasses : inputClasses} disabled={isPerishable}/>
                         </div>
                         <div className="col-span-3 flex items-center space-x-2 mt-2">
                           <input 
                             type="checkbox" 
                             id="isPerishable" 
                             checked={isPerishable} 
                             onChange={handlePerishableChange}
                             className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                           />
                           <label htmlFor="isPerishable" className="text-sm font-medium text-gray-700">
                             Es producto perecedero (no aplica caducidad, lote, marca)
                           </label>
                         </div>
                    </div>
                </div>
                
                <div className="col-span-12">
                    <SectionHeader title="3. DESCRIPCIÓN DE LA NO CONFORMIDAD" />
                    <div className="p-3 bg-white border border-t-0 border-gray-200 rounded-b-md space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Norma Aplicable</label>
                                <select onChange={handleNormaChange} value={selectedNorma} className={selectClasses}>
                                    <option value="" disabled>Seleccionar Norma...</option>
                                    {Object.keys(normasData).map(key => (
                                        <option key={key} value={key}>{normasData[key].norma}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Criterio de Rechazo Aplicable</label>
                                <select onChange={handleCriterioChange} className={selectClasses} disabled={!selectedNorma} defaultValue="">
                                    <option value="" disabled>Seleccionar Criterio...</option>
                                    {criteriosDeRechazo.map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={fieldWrapperClasses}>
                            <label className={labelClasses}>Fundamentación</label>
                            <textarea name="fundamento" value={formData.fundamento} className={`${readonlyInputClasses} resize-none`} rows={3} readOnly></textarea>
                        </div>
                        <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Motivación</label>
                           <textarea name="observacion" value={formData.observacion} onChange={handleChange} className={textareaClasses} rows={2}></textarea>
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Evidencia Objetiva</label>
                           <textarea name="evidenciaObjetiva" value={formData.evidenciaObjetiva} onChange={handleChange} className={textareaClasses} rows={2}></textarea>
                         </div>
                    </div>
                </div>
                
                <div className="col-span-12 lg:col-span-6">
                    <SectionHeader title="4. CONTROL DEL PRODUCTO NO CONFORME" />
                    <div className="p-3 bg-white border border-t-0 border-gray-200 rounded-b-md space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Origen</label>
                                <select name="origen" value={formData.origen} onChange={handleChange} className={selectClasses}>
                                    <option value="" disabled>Seleccionar...</option>
                                    {origenOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Acción Tomada</label>
                                <select name="accionTomada" value={formData.accionTomada} onChange={handleChange} className={selectClasses}>
                                    <option value="" disabled>Seleccionar...</option>
                                    {accionOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Identificación del Producto</label>
                           <input type="text" name="identificacionProducto" value={formData.identificacionProducto} onChange={handleChange} className={inputClasses} />
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Ubicación de Aislamiento</label>
                           <input type="text" name="ubicacionAislamiento" value={formData.ubicacionAislamiento} onChange={handleChange} className={inputClasses} />
                         </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-6">
                     <SectionHeader title="5. EVALUACIÓN Y DISPOSICIÓN" />
                     <div className="p-3 bg-white border border-t-0 border-gray-200 rounded-b-md space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Realizada por</label>
                                <input type="text" name="realizada" value={formData.realizada} onChange={handleChange} className={inputClasses} />
                             </div>
                              <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Fecha de Evaluación</label>
                                <input type="date" name="fechaEvaluacion" value={formData.fechaEvaluacion} onChange={handleChange} className={inputClasses} />
                             </div>
                        </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Resultados de Evaluación</label>
                           <input type="text" name="resultadosEvaluacion" value={formData.resultadosEvaluacion} onChange={handleChange} className={inputClasses} />
                         </div>
                         <div className={fieldWrapperClasses}>
                           <label className={labelClasses}>Acción Seleccionada</label>
                            <select name="accionSeleccionada" value={formData.accionSeleccionada} onChange={handleChange} className={selectClasses}>
                                <option value="" disabled>Seleccionar...</option>
                                {accionOptions.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className={fieldWrapperClasses}>
                               <label className={labelClasses}>Autorizado por</label>
                               <input type="text" name="autorizadoPor" value={formData.autorizadoPor} onChange={handleChange} className={inputClasses} />
                             </div>
                              <div className={fieldWrapperClasses}>
                                <label className={labelClasses}>Fecha de Autorización</label>
                                <input type="date" name="fechaAutorizacion" value={formData.fechaAutorizacion} onChange={handleChange} className={inputClasses} />
                             </div>
                        </div>
                         <div className={`${fieldWrapperClasses} col-span-2`}>
                           <label className={labelClasses}>Justificación de la Decisión</label>
                           <textarea name="justificacionDecision" value={formData.justificacionDecision} onChange={handleChange} className={textareaClasses} rows={3}></textarea>
                         </div>
                     </div>
                </div>

                <div className="col-span-12">
                  <SectionHeader title="6. PLAN DE ACCIONES CORRECTIVAS" />
                  <div className="overflow-x-auto border border-t-0 border-gray-200 rounded-b-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th scope="col" className="px-3 py-1 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-[5%]">No.</th>
                          <th scope="col" className="px-3 py-1 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-[35%]">Descripción de la Acción</th>
                          <th scope="col" className="px-3 py-1 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-[20%]">Responsable</th>
                          <th scope="col" className="px-3 py-1 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-[20%]">Fecha Comp.</th>
                          <th scope="col" className="px-3 py-1 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-[20%]">Fecha Cierre</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.acciones.map((action, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-1 whitespace-nowrap text-sm text-center text-gray-500 align-middle">{index + 1}</td>
                            <td className="p-0"><input type="text" name="descripcion" value={action.descripcion} onChange={(e) => handleActionChange(index, e)} className="w-full h-full px-2 py-1 text-sm bg-transparent border-none focus:ring-0" /></td>
                            <td className="p-0"><input type="text" name="responsable" value={action.responsable} onChange={(e) => handleActionChange(index, e)} className="w-full h-full px-2 py-1 text-sm bg-transparent border-none focus:ring-0" /></td>
                            <td className="p-0"><input type="date" name="fechaCompromiso" value={action.fechaCompromiso} onChange={(e) => handleActionChange(index, e)} className="w-full h-full px-2 py-1 text-sm bg-transparent border-none focus:ring-0" /></td>
                            <td className="p-0"><input type="date" name="fechaCierre" value={action.fechaCierre} onChange={(e) => handleActionChange(index, e)} className="w-full h-full px-2 py-1 text-sm bg-transparent border-none focus:ring-0" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-span-12">
                    <SectionHeader title="7. FIRMAS DE AUTORIZACIÓN" />
                    <div className="grid grid-cols-3 gap-6 mt-2 p-3 bg-white border border-t-0 border-gray-200 rounded-b-md">
                        <div className="border border-gray-300 rounded-lg flex flex-col h-40">
                            <SignaturePad value={formData.detectoFirma} onChange={(dataUrl) => handleSignatureChange('detectoFirma', dataUrl)} />
                            <div className="bg-slate-100 text-center font-bold p-2 border-t border-gray-300 rounded-b-md text-slate-700 flex-shrink-0">DETECTÓ</div>
                        </div>
                        <div className="border border-gray-300 rounded-lg flex flex-col h-40">
                            <SignaturePad value={formData.proveedorFirma} onChange={(dataUrl) => handleSignatureChange('proveedorFirma', dataUrl)} />
                            <div className="bg-slate-100 text-center font-bold p-2 border-t border-gray-300 rounded-b-md text-slate-700 flex-shrink-0">PROVEEDOR</div>
                        </div>
                        <div className="border border-gray-300 rounded-lg flex flex-col h-40">
                           <SignaturePad value={formData.dietologiaFirma} onChange={(dataUrl) => handleSignatureChange('dietologiaFirma', dataUrl)} />
                           <div className="bg-slate-100 text-center font-bold p-2 border-t border-gray-300 rounded-b-md text-slate-700 flex-shrink-0">DIETOLOGÍA</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <footer className="mt-4 pt-4 text-xs text-gray-400 flex justify-between border-t">
          <div>Código del Formato: FO-500.00-15</div>
          <div>Versión: [Número de Versión]</div>
          <div>Fecha de Emisión: [DD/MM/AAAA]</div>
          <div>Fecha de Última Revisión: [DD/MM/AAAA]</div>
        </footer>

      </div>

      <div className="mt-6 no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg flex items-center space-x-2 text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            <path d="M10 11a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span>Exportar a PDF</span>
        </button>
      </div>

    </div>
  );
};

export default App;