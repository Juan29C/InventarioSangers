// Ubicacion Interfaces
export interface CreateUbicacionRequest {
    nombre_ubicacion: string;
}

export interface UbicacionResponse {
    id_ubicacion: number;
    nombre_ubicacion: string;
    activo: boolean;
}
