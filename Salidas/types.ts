
export interface ItemData {
    codigo: number;
    descripcion: string;
    um: string;
    maximo: number;
}

export interface OrderItem {
    id: string;
    codigo: string;
    descripcion: string;
    um: string;
    cantidadPedida: string;
    cantidadSurtida: string;
    observaciones: string;
}
