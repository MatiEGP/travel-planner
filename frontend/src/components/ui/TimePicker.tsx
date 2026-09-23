import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  id?: string;
  time: string; // "HH:mm"
  onChange: (time: string) => void;
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  id,
  time,
  onChange,
  placeholder = 'Seleccionar hora',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'hours' | 'minutes'>('hours');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentHour = time ? time.split(':')[0] : '';
  const currentMinute = time ? time.split(':')[1] : '';

  const handleHourSelect = (hour: string) => {
    if (!time) {
      onChange(`${hour}:00`);
    } else {
      onChange(`${hour}:${currentMinute || '00'}`);
    }
    setView('minutes');
  };

  const handleMinuteSelect = (minute: string) => {
    if (!time) {
      onChange(`00:${minute}`);
    } else {
      onChange(`${currentHour || '00'}:${minute}`);
    }
    setIsOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  return (
    <div className="relative" ref={popoverRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
      >
        <span className={time ? 'text-slate-800 font-medium' : 'text-slate-400'}>
          {time || placeholder}
        </span>
        <Clock className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setView('hours')}
              className={`px-3 py-1.5 rounded-lg text-lg font-bold transition-colors ${
                view === 'hours' ? 'bg-[#FF5A5F] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {currentHour || '--'}
            </button>
            <span className="text-xl font-bold text-slate-400">:</span>
            <button
              type="button"
              onClick={() => setView('minutes')}
              className={`px-3 py-1.5 rounded-lg text-lg font-bold transition-colors ${
                view === 'minutes' ? 'bg-[#FF5A5F] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {currentMinute || '--'}
            </button>
          </div>
          
          <div className="p-3">
            {view === 'hours' ? (
              <div className="grid grid-cols-4 gap-2">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                      currentHour === h
                        ? 'bg-rose-100 text-[#FF5A5F]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteSelect(m)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                      currentMinute === m
                        ? 'bg-rose-100 text-[#FF5A5F]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
