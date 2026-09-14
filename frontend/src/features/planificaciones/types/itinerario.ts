export interface DiaItinerarioRequestDTO {
  planificacionId: number;
  fecha: string; // Format: YYYY-MM-DD
}

export interface ItemItinerarioRequestDTO {
  diaItinerarioId: number;
  horaInicio?: string; // Format: HH:mm
  horaFin?: string;    // Format: HH:mm
  tipo: string;
  referenciaId?: number;
  notas?: string;
}

export interface ItemItinerarioResponseDTO {
  id: number;
  diaItinerarioId: number;
  horaInicio?: string;
  horaFin?: string;
  tipo: string;
  referenciaId?: number;
  notas?: string;
}

export interface DiaItinerarioResponseDTO {
  id: number;
  planificacionId: number;
  fecha: string;
  items?: ItemItinerarioResponseDTO[];
}

// Backwards-compatibility aliases for legacy components
export interface CostoDTO {
  id?: string | number;
  monto: number;
  moneda: string;
  categoria: string;
  pagado: boolean;
}

export interface ItemItinerarioDTO {
  id: string | number;
  tipo: string;
  titulo?: string;
  descripcion?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  costos?: CostoDTO[];
}

export interface DiaItinerarioDTO {
  id: string | number;
  planificacionId?: number;
  fecha: string;
  items?: ItemItinerarioDTO[];
}
