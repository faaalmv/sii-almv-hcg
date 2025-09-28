
import { Contrato, ContractStatus, MilestoneStatus, IncidenceType, IncidenceStatus } from '../types';

export const mockContratos: Contrato[] = [
  {
    id: "CON-001",
    proveedor: { id: "PROV-A", nombre: "Distribuidora de Alimentos del Norte S.A." },
    fechaInicio: "2024-01-15",
    fechaFin: "2024-12-31",
    montoTotal: 500000,
    status: ContractStatus.EnRegla,
    hitosDeEntrega: [
      { id: "HITO-001-A", descripcion: "Entrega de 100kg de arroz", fechaPactada: "2024-03-01", status: MilestoneStatus.Cumplido },
      { id: "HITO-001-B", descripcion: "Entrega de 50L de aceite", fechaPactada: "2024-06-15", status: MilestoneStatus.Pendiente },
      { id: "HITO-001-C", descripcion: "Entrega de 200kg de frijol", fechaPactada: "2024-09-20", status: MilestoneStatus.Pendiente },
    ],
    incidencias: [],
  },
  {
    id: "CON-002",
    proveedor: { id: "PROV-B", nombre: "Comercializadora de Lácteos de Occidente" },
    fechaInicio: "2024-02-01",
    fechaFin: "2025-01-31",
    montoTotal: 750000,
    status: ContractStatus.ConIncidencias,
    hitosDeEntrega: [
      { id: "HITO-002-A", descripcion: "Entrega de 500L de leche", fechaPactada: "2024-04-10", status: MilestoneStatus.Cumplido },
      { id: "HITO-002-B", descripcion: "Entrega de 200kg de queso", fechaPactada: "2024-05-20", status: MilestoneStatus.Atrasado },
      { id: "HITO-002-C", descripcion: "Entrega de 100kg de crema", fechaPactada: "2024-08-01", status: MilestoneStatus.Pendiente },
    ],
    incidencias: [
      {
        id: "INC-001",
        hitoId: "HITO-002-B",
        tipo: IncidenceType.Atraso,
        descripcion: "El proveedor entregó la mercancía 5 días después de la fecha pactada.",
        fechaDeteccion: "2024-05-25",
        status: IncidenceStatus.Abierta,
      },
    ],
  },
  {
    id: "CON-003",
    proveedor: { id: "PROV-C", nombre: "Logística y Abastecimiento del Sureste" },
    fechaInicio: "2023-11-10",
    fechaFin: "2024-11-09",
    montoTotal: 1200000,
    status: ContractStatus.EnRiesgo,
    hitosDeEntrega: [
      { id: "HITO-003-A", descripcion: "Entrega de material de curación", fechaPactada: "2024-01-20", status: MilestoneStatus.Atrasado },
      { id: "HITO-003-B", descripcion: "Entrega de equipo de protección", fechaPactada: "2024-04-30", status: MilestoneStatus.Incumplido },
      { id: "HITO-003-C", descripcion: "Entrega de insumos de limpieza", fechaPactada: "2024-07-10", status: MilestoneStatus.Pendiente },
    ],
    incidencias: [
        { id: "INC-002", hitoId: "HITO-003-A", tipo: IncidenceType.Atraso, descripcion: "Entrega con 15 días de retraso.", fechaDeteccion: "2024-02-04", status: IncidenceStatus.PenalizacionAplicada, penalizacion: { id: "PEN-001", monto: 18000, folio: "987ABC", fechaNotificacion: "2024-02-10", calculo: { diasAtraso: 15, formula: "(Monto Hito x 3%)", total: 18000 }}},
        { id: "INC-003", hitoId: "HITO-003-B", tipo: IncidenceType.Incompleto, descripcion: "Faltó el 30% de la mercancía solicitada.", fechaDeteccion: "2024-04-30", status: IncidenceStatus.EnRevision },
    ],
  },
  {
    id: "CON-004",
    proveedor: { id: "PROV-D", nombre: "Proveedora de Frutas y Verduras S. de R.L." },
    fechaInicio: "2024-03-01",
    fechaFin: "2024-09-30",
    montoTotal: 300000,
    status: ContractStatus.EnRegla,
    hitosDeEntrega: [
      { id: "HITO-004-A", descripcion: "Entrega semanal de perecederos (Marzo)", fechaPactada: "2024-03-31", status: MilestoneStatus.Cumplido },
      { id: "HITO-004-B", descripcion: "Entrega semanal de perecederos (Abril)", fechaPactada: "2024-04-30", status: MilestoneStatus.Cumplido },
      { id: "HITO-004-C", descripcion: "Entrega semanal de perecederos (Mayo)", fechaPactada: "2024-05-31", status: MilestoneStatus.Pendiente },
    ],
    incidencias: [],
  },
  {
    id: "CON-005",
    proveedor: { id: "PROV-A", nombre: "Distribuidora de Alimentos del Norte S.A." },
    fechaInicio: "2024-05-01",
    fechaFin: "2024-10-31",
    montoTotal: 450000,
    status: ContractStatus.ConPenalizacion,
    hitosDeEntrega: [
      { id: "HITO-005-A", descripcion: "Entrega de 500kg harina", fechaPactada: "2024-05-15", status: MilestoneStatus.Atrasado },
      { id: "HITO-005-B", descripcion: "Entrega de 100kg azúcar", fechaPactada: "2024-07-01", status: MilestoneStatus.Pendiente },
    ],
    incidencias: [
        { id: "INC-004", hitoId: "HITO-005-A", tipo: IncidenceType.Atraso, descripcion: "Entrega con 7 días de retraso.", fechaDeteccion: "2024-05-22", status: IncidenceStatus.PenalizacionAplicada, penalizacion: { id: "PEN-002", monto: 5250, folio: "123XYZ", fechaNotificacion: "2024-05-28", calculo: { diasAtraso: 7, formula: "(Monto Hito x 1.5%)", total: 5250 } } },
    ],
  },
];
