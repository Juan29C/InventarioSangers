// Categoria Producto Interfaces
export interface CreateCategoriaRequest {
    nombre_categoria: string;
}

export interface CategoriaResponse {
    id_categoria: number;
    nombre_categoria: string;
}

// Tipo Categoria Interfaces
export interface CreateTipoRequest {
    id_categoria: number;
    nombre_tipo: string;
    activo: boolean;
}

export interface TipoResponse {
    id_tipo: number;
    id_categoria: number;
    nombre_tipo: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
}
