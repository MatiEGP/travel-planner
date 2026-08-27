import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuickCreateCard } from '../QuickCreateCard';

describe('QuickCreateCard', () => {
  it('renders QuickCreateCard correctly and responds to click', () => {
    const handleClick = vi.fn();
    render(<QuickCreateCard onClick={handleClick} />);

    expect(screen.getByText('Crear nueva planificación')).toBeInTheDocument();
    
    const card = screen.getByRole('button', { name: /Crear nueva planificación/i });
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('triggers onClick on Enter and Space keypress', () => {
    const handleClick = vi.fn();
    render(<QuickCreateCard onClick={handleClick} />);

    const card = screen.getByRole('button', { name: /Crear nueva planificación/i });
    
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
