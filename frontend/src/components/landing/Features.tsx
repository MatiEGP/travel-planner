import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, CalendarDays, MousePointer2 } from 'lucide-react';
import React from 'react';

const mockFeatures = [
  { id: 1, title: 'Itinerarios Día a Día', desc: 'Estructurá cada día de tu viaje con horarios, notas y paradas esenciales.', icon: CalendarDays, color: 'text-ocean-500' },
  { id: 2, title: 'Destinos Favoritos', desc: 'Agregá y organizá los puntos de interés, visitas guiadas y atracciones.', icon: MapPin, color: 'text-coral-500' },
  { id: 3, title: 'Gestión Interactiva', desc: 'Organizá tus actividades de forma visual y rápida.', icon: MousePointer2, color: 'text-nature-500' },
];

function TiltCard({ feature }: { feature: typeof mockFeatures[0] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg cursor-grab active:cursor-grabbing flex flex-col items-center text-center gap-6 h-full"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
    >
      <div 
        style={{ transform: "translateZ(50px)" }} 
        className={`w-16 h-16 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl ${feature.color} shadow-sm shrink-0`}
      >
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <div style={{ transform: "translateZ(30px)" }} className="flex flex-col grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Mucho más que un Excel
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Interactuá con las tarjetas, arrastralas. Literalmente, construí tu viaje.
          </p>
        </div>
        
        {/* Grilla 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px] items-stretch">
          {mockFeatures.map((feat) => (
            <TiltCard key={feat.id} feature={feat} />
          ))}
        </div>
      </div>
    </section>
  );
}
