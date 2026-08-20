export interface PlanificacionRequestDTO {
  usuarioId: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string; // Format: YYYY-MM-DD
  fechaFin: string;    // Format: YYYY-MM-DD
}

export interface PlanificacionResponseDTO {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}
