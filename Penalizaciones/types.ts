
export enum ContractStatus {
  EnRegla = "En Regla",
  ConIncidencias = "Con Incidencias",
  EnRiesgo = "En Riesgo",
  ConPenalizacion = "Con Penalización Aplicada",
}

export enum MilestoneStatus {
  Pendiente = "Pendiente",
  Cumplido = "Cumplido",
  Atrasado = "Atrasado",
  Incumplido = "Incumplido",
}

export enum IncidenceType {
  Atraso = "Atraso en Entrega",
  Incompleto = "Entrega Incompleta",
  Calidad = "Calidad Deficiente",
}

export enum IncidenceStatus {
  Abierta = "Abierta",
  EnRevision = "En Revisión",
  PenalizacionAplicada = "Penalización Aplicada",
  Cerrada = "Cerrada",
}

export interface Proveedor {
  id: string;
  nombre: string;
}

export interface Penalizacion {
  id: string;
  monto: number;
  folio: string;
  fechaNotificacion: string;
  calculo: {
    diasAtraso: number;
    formula: string;
    total: number;
  };
}

export interface Incidencia {
  id: string;
  hitoId: string;
  tipo: IncidenceType;
  descripcion: string;
  fechaDeteccion: string;
  status: IncidenceStatus;
  penalizacion?: Penalizacion;
}

export interface HitoDeEntrega {
  id: string;
  descripcion: string;
  fechaPactada: string;
  status: MilestoneStatus;
}

export interface Contrato {
  id: string;
  proveedor: Proveedor;
  fechaInicio: string;
  fechaFin: string;
  montoTotal: number;
  status: ContractStatus;
  hitosDeEntrega: HitoDeEntrega[];
  incidencias: Incidencia[];
}
