export interface DestinoRequestDTO {
  planificacionId: number;
  nombre: string;
  pais: string;
  ciudad: string;
  notas: string;
}

export interface DestinoResponseDTO {
  id: number;
  nombre: string;
  pais: string;
  ciudad: string;
  notas: string;
}
