
export enum EstadoFactura {
  RECEPCION = 'Recepción',
  EN_VALIDACION_GLOSA = 'En Validación de Glosa',
  VALIDACION_PRESUPUESTO = 'Validación de Presupuesto',
  APROBADA_PARA_PAGO = 'Aprobada para Pago',
  PAGADA = 'Pagada',
  RECHAZADA = 'Rechazada',
}

export interface HistorialItem {
  etapa: EstadoFactura;
  fecha: string;
  usuario: string;
  motivoRechazo?: string;
  comentarios?: string;
}

export interface OrdenDeCompra {
  id: string;
  numeroOC: string;
  fechaElaboracion: string;
  montoTotal: number;
  montoConsumido: number;
  facturasVinculadasIds: string[];
}

export interface Factura {
  id: string;
  proveedorId: string;
  folioFiscal: string;
  monto: number;
  fechaCarga: string;
  estadoActual: EstadoFactura;
  historial: HistorialItem[];
  razonSocial: string;
  rfc: string;
  pdfFile?: File;
  xmlFile?: File;
  ordenDeCompraId?: string;
}

export const ROL_USUARIO_VALUES = {
  PROVEEDOR: 'Proveedor',
  VALIDADOR_GLOSA: 'Validador Glosa',
  VALIDADOR_PRESUPUESTO: 'Validador Presupuesto',
} as const;

export type RolUsuario = typeof ROL_USUARIO_VALUES[keyof typeof ROL_USUARIO_VALUES];


export interface Usuario {
  id: string;
  nombre: string;
  rol: RolUsuario;
  rfc?: string;
}

export interface ExtractedCFDIData {
  razonSocial: string;
  rfc: string;
  monto: number;
  folioFiscal: string;
}
