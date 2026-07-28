export interface ActividadRequestDTO {
  destinoId: number;
  nombre: string;
  fechaHora: string; // Format: YYYY-MM-DDTHH:MM:SS (LocalDateTime)
  notas: string;
}

export interface ActividadResponseDTO {
  id: number;
  nombre: string;
  fechaHora: string;
  notas: string;
}
