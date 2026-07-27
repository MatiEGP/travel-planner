export interface UsuarioRequestDTO {
    nombre: string;
    email: string;
    password?: string;
}

export interface UsuarioResponseDTO {
    id: number;
    nombre: string;
    email: string;
    fechaRegistro: string;
}