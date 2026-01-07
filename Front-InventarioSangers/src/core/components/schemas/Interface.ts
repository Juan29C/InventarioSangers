// Login Interfaces
export interface LoginRequest {
    email: string;
    password: string;
}

export interface Usuario {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    rol: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    usuario: Usuario;
    token: string;
    token_type: string;
}
