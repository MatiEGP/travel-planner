export interface CostoRequestDTO {
  planificacionId: number;
  categoria: string;
  monto: number;
  descripcion: string;
}

export interface CostoResponseDTO {
  id: number;
  planificacionId: number;
  categoria: string;
  monto: number;
  descripcion: string;
}
