export interface ActionItem {
  descripcion: string;
  responsable: string;
  fechaCompromiso: string;
  fechaCierre: string;
}

export interface Article {
  codigo: number;
  descripcion_articulo: string;
}

export interface PurchaseOrder {
  proveedor: string;
  proceso_licitacion: string;
  articulos: Article[];
}

export interface PurchaseOrdersData {
  [key: string]: PurchaseOrder;
}

export interface Criterio {
  numeral: string;
  principio: string;
  criterio?: string;
}

export interface CriterioCategoriaParametro {
  parametro: string;
  aceptacion: string;
  rechazo: string;
}

export interface CriterioCategoria {
  categoria: string;
  parametros: CriterioCategoriaParametro[];
}

export interface PrincipiosNormativos {
  criterios_de_aceptacion?: Criterio[];
  criterios_de_rechazo?: Criterio[];
  criterios_generales?: Criterio[];
  criterios_por_categoria?: CriterioCategoria[];
}

export interface Norma {
  norma: string;
  titulo: string;
  principios_normativos: PrincipiosNormativos;
}

export interface NormasData {
  [key: string]: Norma;
}


export interface FormData {
  folio: string;
  fecha: string;
  ordenDeCompra: string;
  proceso: string;
  proveedor: string;
  codigo: string;
  descripcion: string;
  cantidad: string;
  fechaCaducidad: string;
  lote: string;
  marca: string;
  fundamento: string;
  observacion: string;
  evidenciaObjetiva: string;
  origen: string;
  accionTomada: string;
  identificacionProducto: string;
  ubicacionAislamiento: string;
  accionesInmediatas: string;
  realizada: string;
  fechaEvaluacion: string;
  resultadosEvaluacion: string;
  accionSeleccionada: string;
  justificacionDecision: string;
  autorizadoPor: string;
  fechaAutorizacion: string;
  acciones: ActionItem[];
  detectoFirma: string;
  proveedorFirma: string;
  dietologiaFirma: string;
}