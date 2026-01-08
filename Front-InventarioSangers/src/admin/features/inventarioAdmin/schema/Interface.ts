// Producto/Inventario Interfaces
export interface CreateProductoRequest {
    sku: string;
    nombre: string;
    descripcion?: string;
    precio_compra: number;
    precio_venta_unitario: number;
    stock_minimo: number;
    id_categoria: number;
    id_tipo: number;
    activo: boolean;
}

export interface ProductoResponse {
    id_producto: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    precio_compra: string;
    precio_venta_unitario: string;
    stock_minimo: number;
    id_categoria: number;
    id_tipo: number;
    activo: boolean;
    created_at: string;
    updated_at: string;
    categoria: {
        id_categoria: number;
        nombre_categoria: string;
    };
    tipo: {
        id_tipo: number;
        id_categoria: number;
        nombre_tipo: string;
        activo: boolean;
        created_at: string;
        updated_at: string;
    };
}

// Stock Entry (Entrada) Interfaces
export interface CreateEntradaRequest {
    id_producto: number;
    id_ubicacion: number;
    cantidad: number;
    motivo: string;
    referencia?: string;
}

export interface MovimientoResponse {
    id_movimiento: number;
    id_producto: number;
    id_ubicacion: number;
    tipo: string;
    cantidad: number;
    motivo: string;
    referencia?: string;
}

export interface EntradaResponse {
    ok: boolean;
    movimiento: MovimientoResponse;
}

// Stock Exit (Salida) Interfaces
export interface CreateSalidaRequest {
    id_producto: number;
    id_ubicacion: number;
    cantidad: number;
    motivo: string;
    referencia?: string;
}

export interface SalidaResponse {
    ok: boolean;
    movimiento: MovimientoResponse;
}

// Stock Transfer (Traslado) Interfaces
export interface CreateTrasladoRequest {
    id_producto: number;
    id_ubicacion_origen: number;
    id_ubicacion_destino: number;
    cantidad: number;
    motivo: string;
    referencia?: string;
}

export interface TrasladoResponse {
    ok: boolean;
    referencia?: string;
    salida: MovimientoResponse;
    entrada: MovimientoResponse;
}

// Stock by Location Interfaces
export interface StockUbicacionResponse {
    id_stock: number;
    id_producto: number;
    id_ubicacion: number;
    cantidad: number;
    producto: ProductoResponse;
    ubicacion: {
        id_ubicacion: number;
        nombre_ubicacion: string;
        activo: boolean;
    };
}

// Promotion Interfaces
export interface CreatePromocionRequest {
    id_producto: number;
    cantidad_minima: number;
    precio_oferta: number;
    prioridad: number;
    activo: boolean;
}

export interface UpdatePromocionRequest {
    cantidad_minima?: number;
    precio_oferta?: number;
    prioridad?: number;
    activo?: boolean;
}

export interface PromocionResponse {
    id_promo: number;
    id_producto: number;
    cantidad_minima: number;
    precio_oferta: string;
    prioridad: number;
    activo: boolean;
    created_at: string;
    updated_at: string;
    producto?: ProductoResponse;
}
