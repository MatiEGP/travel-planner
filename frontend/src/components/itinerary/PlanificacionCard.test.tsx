import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlanificacionCard, DestinoWithActividades } from './PlanificacionCard';
import type { PlanificacionResponseDTO } from '../../types/planificacion';

describe('PlanificacionCard', () => {
  const mockPlanificacion: PlanificacionResponseDTO = {
    id: 1,
    titulo: 'Trip to Europe',
    descripcion: 'A fun trip across Europe',
    fechaInicio: '2023-10-01',
    fechaFin: '2023-10-15',
  };

  const mockDestinos: DestinoWithActividades[] = [
    {
      id: 101,
      nombre: 'Paris Trip',
      ciudad: 'Paris',
      pais: 'France',
      notas: '',
      actividades: [
        { id: 1001, nombre: 'Eiffel Tower', fechaHora: '2023-10-02T10:00:00', notas: '' },
        { id: 1002, nombre: 'Louvre', fechaHora: '2023-10-03T09:00:00', notas: '' },
      ],
    },
    {
      id: 102,
      nombre: 'Rome Trip',
      ciudad: 'Rome',
      pais: 'Italy',
      notas: '',
      actividades: [
        { id: 1003, nombre: 'Colosseum', fechaHora: '2023-10-05T14:00:00', notas: '' }
      ],
    },
  ];

  it('renders planificacion details and nested children correctly', () => {
    const { container } = render(
      <PlanificacionCard planificacion={mockPlanificacion} destinos={mockDestinos} />
    );

    // Check Planificacion details
    expect(screen.getByText('Trip to Europe')).toBeInTheDocument();
    
    // Check Destino details
    expect(screen.getByText('Paris Trip')).toBeInTheDocument();
    expect(screen.getByText('Rome Trip')).toBeInTheDocument();

    // Check Actividad details
    expect(screen.getByText('Eiffel Tower')).toBeInTheDocument();
    expect(screen.getByText('Louvre')).toBeInTheDocument();
    expect(screen.getByText('Colosseum')).toBeInTheDocument();

    // Check child counts based on DOM elements
    // 2 MiniDestinoCard containers should exist (rendered as <h4> for title, so 2 h4s)
    const destinoHeadings = container.querySelectorAll('h4');
    expect(destinoHeadings.length).toBe(2);

    // 3 ActivityListItem containers should exist (rendered as <li>)
    const activityItems = container.querySelectorAll('li');
    expect(activityItems.length).toBe(3);
  });

  it('renders correctly without destinations', () => {
    render(<PlanificacionCard planificacion={mockPlanificacion} />);
    expect(screen.getByText('No destinations added to this trip yet.')).toBeInTheDocument();
  });
});
