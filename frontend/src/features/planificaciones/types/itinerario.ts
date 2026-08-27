export interface CostoDTO {
  id?: string;
  monto: number;
  moneda: string;
  categoria: string;
  pagado: boolean;
}

export interface ItemItinerarioDTO {
  id: string;
  tipo: string;
  titulo: string;
  descripcion?: string;
  horaInicio?: string;
  horaFin?: string;
  costos: CostoDTO[];
}

export interface DiaItinerarioDTO {
  id: string;
  fecha: string;
  items: ItemItinerarioDTO[];
}
