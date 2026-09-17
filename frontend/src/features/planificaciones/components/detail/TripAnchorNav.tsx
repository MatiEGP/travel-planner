import React, { useEffect, useState } from 'react';
import { MapPin, Sparkles, CreditCard, CalendarDays } from 'lucide-react';

export interface AnchorItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface TripAnchorNavProps {
  destinosCount: number;
  actividadesCount: number;
  gastosCount: number;
  diasCount: number;
}

export const TripAnchorNav: React.FC<TripAnchorNavProps> = ({
  destinosCount,
  actividadesCount,
  gastosCount,
  diasCount,
}) => {
  const [activeSection, setActiveSection] = useState<string>('section-destinos');

  const navItems: AnchorItem[] = [
    { id: 'section-destinos', label: 'Destinos', icon: MapPin, count: destinosCount },
    { id: 'section-actividades', label: 'Actividades', icon: Sparkles, count: actividadesCount },
    { id: 'section-gastos', label: 'Gastos', icon: CreditCard, count: gastosCount },
    { id: 'section-itinerario', label: 'Itinerario', icon: CalendarDays, count: diasCount },
  ];

  useEffect(() => {
    const sectionIds = ['section-destinos', 'section-actividades', 'section-gastos', 'section-itinerario'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the top intersecting entry or highest intersection ratio
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top distance to viewport top
          const topEntry = visibleEntries.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top && curr.boundingClientRect.top >= 0
              ? curr
              : prev
          );
          setActiveSection(topEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <nav
      className="sticky top-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-1"
      aria-label="Navegación del viaje"
    >
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Contenido del viaje
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleScrollTo(item.id)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              isActive
                ? 'bg-rose-50 text-[#FF5A5F] shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5A5F]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#FF5A5F] text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
