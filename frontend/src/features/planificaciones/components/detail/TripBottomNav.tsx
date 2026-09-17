import React, { useEffect, useState } from 'react';
import { MapPin, Sparkles, CreditCard, CalendarDays } from 'lucide-react';

interface TripBottomNavProps {
  destinosCount: number;
  actividadesCount: number;
  gastosCount: number;
  diasCount: number;
}

export const TripBottomNav: React.FC<TripBottomNavProps> = ({
  destinosCount,
  actividadesCount,
  gastosCount,
  diasCount,
}) => {
  const [activeSection, setActiveSection] = useState<string>('section-destinos');

  const navItems = [
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
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleScrollTo(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-[#FF5A5F] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF5A5F]' : 'text-slate-500'}`} />
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isActive ? 'bg-[#FF5A5F] text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
