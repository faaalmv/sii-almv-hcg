
import { Factura, EstadoFactura, Usuario, RolUsuario as RolUsuarioType, OrdenDeCompra, RolUsuario } from './types';

export const ESTADOS_FACTURA_ORDEN: EstadoFactura[] = [
  EstadoFactura.RECEPCION,
  EstadoFactura.EN_VALIDACION_GLOSA,
  EstadoFactura.VALIDACION_PRESUPUESTO,
  EstadoFactura.APROBADA_PARA_PAGO,
  EstadoFactura.PAGADA,
];

export const MOCK_USUARIOS: Usuario[] = [
  { id: 'prov-01', nombre: 'MARIA DOLORES BAÑUELOS AREVALO', rol: RolUsuario.PROVEEDOR, rfc: 'BAAD630225F2A' },
  { id: 'prov-02', nombre: 'ALFONSO NÚÑEZ DE LA O', rol: RolUsuario.PROVEEDOR, rfc: 'NUOA700202YYY' },
  { id: 'prov-03', nombre: 'FELIPE DE JESUS MORALES RIOS', rol: RolUsuario.PROVEEDOR, rfc: 'MORF600303ZZZ' },
  { id: 'prov-04', nombre: 'PEÑA PEÑA FRANCISCA LETICIA', rol: RolUsuario.PROVEEDOR, rfc: 'PEPF500404AAA' },
  { id: 'prov-05', nombre: 'CHIC & CHICKEN SA DE CV', rol: RolUsuario.PROVEEDOR, rfc: 'CCH123456789' },
  { id: 'prov-06', nombre: 'BUENISSIMO MEAT', rol: RolUsuario.PROVEEDOR, rfc: 'BME987654321' },
  { id: 'prov-07', nombre: 'CORPORATIVO DAAGALBA, S.A. DE C.V.', rol: RolUsuario.PROVEEDOR, rfc: 'CDA112233445' },
  { id: 'func-01', nombre: 'ALMACÉN', rol: RolUsuario.VALIDADOR_GLOSA },
  { id: 'func-02', nombre: 'RECURSOS FINANCIEROS', rol: RolUsuario.VALIDADOR_PRESUPUESTO },
];

export const MOCK_ORDENES_DE_COMPRA: OrdenDeCompra[] = [
    {
        id: 'oc-01',
        numeroOC: 'OC/25/10401634',
        fechaElaboracion: '2023-10-20T00:00:00Z',
        montoTotal: 132588.83,
        montoConsumido: 7834.00,
        facturasVinculadasIds: ['fac-002']
    },
    {
        id: 'oc-02',
        numeroOC: 'OC/25/10401635',
        fechaElaboracion: '2023-10-15T00:00:00Z',
        montoTotal: 50000.00,
        montoConsumido: 0,
        facturasVinculadasIds: []
    }
];


const PROVEEDOR_FACTURAS = MOCK_USUARIOS.find(u => u.id === 'prov-05')!;

export const MOCK_FACTURAS: Factura[] = [
  {
    id: 'fac-001',
    proveedorId: PROVEEDOR_FACTURAS.id,
    folioFiscal: 'A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D',
    monto: 15086.06,
    fechaCarga: '2023-10-26T10:00:00Z',
    estadoActual: EstadoFactura.VALIDACION_PRESUPUESTO,
    razonSocial: PROVEEDOR_FACTURAS.nombre,
    rfc: PROVEEDOR_FACTURAS.rfc!,
    historial: [
      { etapa: EstadoFactura.RECEPCION, fecha: '2023-10-26T10:00:00Z', usuario: 'Sistema', comentarios: 'Factura recibida a través del portal.' },
      { etapa: EstadoFactura.EN_VALIDACION_GLOSA, fecha: '2023-10-26T14:30:00Z', usuario: 'ALMACÉN', comentarios: 'Se valida que los conceptos coinciden con la orden de compra #5821. Pasa a la siguiente validación.' },
    ],
  },
  {
    id: 'fac-002',
    proveedorId: PROVEEDOR_FACTURAS.id,
    folioFiscal: 'F6E5D4C3-B2A1-4B5C-8D9E-0F1E2D3C4B5A',
    monto: 7834.00,
    fechaCarga: '2023-10-25T15:20:00Z',
    estadoActual: EstadoFactura.PAGADA,
    razonSocial: PROVEEDOR_FACTURAS.nombre,
    rfc: PROVEEDOR_FACTURAS.rfc!,
    ordenDeCompraId: 'oc-01',
    historial: [
      { etapa: EstadoFactura.RECEPCION, fecha: '2023-10-25T15:20:00Z', usuario: 'Sistema', comentarios: 'Factura recibida a través del portal.' },
      { etapa: EstadoFactura.EN_VALIDACION_GLOSA, fecha: '2023-10-25T18:00:00Z', usuario: 'ALMACÉN', comentarios: 'Conceptos correctos.' },
      { etapa: EstadoFactura.VALIDACION_PRESUPUESTO, fecha: '2023-10-26T09:00:00Z', usuario: 'RECURSOS FINANCIEROS', comentarios: 'Presupuesto autorizado.' },
      { etapa: EstadoFactura.APROBADA_PARA_PAGO, fecha: '2023-10-26T11:00:00Z', usuario: 'Sistema', comentarios: 'Programada para pago.' },
      { etapa: EstadoFactura.PAGADA, fecha: '2023-10-27T16:00:00Z', usuario: 'Tesorería', comentarios: 'Pago realizado vía transferencia.' },
    ],
  },
  {
    id: 'fac-003',
    proveedorId: PROVEEDOR_FACTURAS.id,
    folioFiscal: '9A8B7C6D-5E4F-4A3B-2C1D-0F9E8D7C6B5A',
    monto: 21300.75,
    fechaCarga: '2023-10-24T09:00:00Z',
    estadoActual: EstadoFactura.RECHAZADA,
    razonSocial: PROVEEDOR_FACTURAS.nombre,
    rfc: PROVEEDOR_FACTURAS.rfc!,
    historial: [
      { etapa: EstadoFactura.RECEPCION, fecha: '2023-10-24T09:00:00Z', usuario: 'Sistema', comentarios: 'Factura recibida.' },
      {
        etapa: EstadoFactura.RECHAZADA,
        fecha: '2023-10-24T12:45:00Z',
        usuario: 'ALMACÉN',
        motivoRechazo: 'El monto en el PDF no coincide con el XML. Favor de corregir y reenviar.',
      },
    ],
  },
  {
    id: 'fac-004',
    proveedorId: PROVEEDOR_FACTURAS.id,
    folioFiscal: 'C4D5E6F7-A8B9-4C5D-6E7F-1A2B3C4D5E6F',
    monto: 5400.00,
    fechaCarga: '2023-10-27T11:30:00Z',
    estadoActual: EstadoFactura.EN_VALIDACION_GLOSA,
    razonSocial: PROVEEDOR_FACTURAS.nombre,
    rfc: PROVEEDOR_FACTURAS.rfc!,
    historial: [{ etapa: EstadoFactura.RECEPCION, fecha: '2023-10-27T11:30:00Z', usuario: 'Sistema', comentarios: 'Factura recibida, en espera de validación.' }],
  },
];

export const MOTIVOS_RECHAZO_COMUNES = [
    "El monto en el PDF no coincide con el XML.",
    "Falta la orden de compra adjunta.",
    "El RFC del emisor es incorrecto.",
    "La descripción de los productos no es clara.",
    "El folio fiscal ya fue registrado previamente."
];
