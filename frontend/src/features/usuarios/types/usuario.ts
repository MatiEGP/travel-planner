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
  roles: string[];
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegistroRequestDTO {
  nombre: string;
  email: string;
  password: string;
}
