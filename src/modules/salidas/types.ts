
export interface Lote {
  id: string;
  fechaCaducidad: Date;
  cantidad: number;
}

export interface ItemData {
    codigo: number;
    descripcion: string;
    um: string;
    maximo: number;
    lotes: Lote[];
}

export interface OrderItem {
    id: string;
    codigo: string;
    descripcion: string;
    um: string;
    cantidadPedida: number;
    cantidadSurtida: number;
    observaciones: string;
}
