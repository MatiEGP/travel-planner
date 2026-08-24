import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DiscoveryNavbar from './DiscoveryNavbar';

describe('DiscoveryNavbar', () => {
  it('renders with transparent background initially', () => {
    render(<DiscoveryNavbar />);
    const nav = screen.getByTestId('discovery-navbar');
    expect(nav.className).toContain('bg-transparent');
    expect(nav.className).not.toContain('bg-white');
  });

  it('changes to solid background on scroll', () => {
    render(<DiscoveryNavbar />);
    const nav = screen.getByTestId('discovery-navbar');
    
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    
    expect(nav.className).toContain('bg-white');
    expect(nav.className).toContain('shadow-soft');
    expect(nav.className).not.toContain('bg-transparent');
  });

  it('reverts to transparent when scrolled back to top', () => {
    render(<DiscoveryNavbar />);
    const nav = screen.getByTestId('discovery-navbar');
    
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    expect(nav.className).toContain('bg-white');
    
    fireEvent.scroll(window, { target: { scrollY: 0 } });
    expect(nav.className).toContain('bg-transparent');
  });
});
