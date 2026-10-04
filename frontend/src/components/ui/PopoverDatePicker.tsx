import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { CalendarDatePicker } from './CalendarDatePicker';

interface PopoverDatePickerProps {
  id?: string;
  date: string;
  minDate?: string;
  maxDate?: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export const PopoverDatePicker: React.FC<PopoverDatePickerProps> = ({
  id,
  date,
  minDate,
  maxDate,
  onChange,
  placeholder = 'Seleccionar fecha',
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleDateChange = (newDate: string) => {
    onChange(newDate);
    setIsOpen(false);
  };

  const formattedDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : '';

  return (
    <div className="relative" ref={popoverRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
      >
        <span className={date ? 'text-slate-800 font-medium' : 'text-slate-400'}>
          {date ? formattedDate : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 w-full sm:w-[320px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <CalendarDatePicker
            date={date}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
};
