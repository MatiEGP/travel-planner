import React, { useState } from 'react';

interface CalendarDatePickerProps {
  date: string;
  minDate?: string;
  maxDate?: string;
  onChange: (date: string) => void;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  date,
  minDate,
  maxDate,
  onChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (date) {
      const [year, month] = date.split('-');
      return new Date(Number(year), Number(month) - 1, 1);
    }
    if (minDate) {
      const [year, month] = minDate.split('-');
      return new Date(Number(year), Number(month) - 1, 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const [view, setView] = useState<'days' | 'months'>('days');

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    const ds = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (minDate && ds < minDate) return;
    if (maxDate && ds > maxDate) return;

    onChange(ds);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const shortMonthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div className="w-full bg-[#F1F3F4] rounded-xl p-4 select-none min-h-[340px] flex flex-col">
      {view === 'days' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &lt;
            </button>
            <button 
              type="button" 
              onClick={() => setView('months')}
              className="font-bold text-slate-700 hover:text-coral-500 transition-colors px-3 py-1 hover:bg-slate-200 rounded-lg"
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </button>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
            <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-sm flex-1">
            {blanks.map(b => <div key={`blank-${b}`} />)}
            {days.map(d => {
              const ds = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const selected = ds === date;
              const isOutOfBounds = (minDate && ds < minDate) || (maxDate && ds > maxDate);
              
              let btnClass = "w-8 h-8 flex items-center justify-center rounded-full z-10 transition-all font-medium ";
              
              if (selected) {
                btnClass += "bg-[#FF5A5F] text-white shadow-md font-bold";
              } else if (isOutOfBounds) {
                btnClass += "text-slate-300 cursor-not-allowed";
              } else {
                btnClass += "text-slate-700 hover:bg-slate-200 cursor-pointer";
              }

              return (
                <div key={d} className="relative flex justify-center items-center h-8 w-full">
                  <button
                    type="button"
                    onClick={() => handleDayClick(d)}
                    disabled={isOutOfBounds}
                    className={btnClass}
                  >
                    {d}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &lt;
            </button>
            <span className="font-bold text-slate-700">{currentMonth.getFullYear()}</span>
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-1 items-center">
            {shortMonthNames.map((m, idx) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), idx, 1));
                  setView('days');
                }}
                className={`py-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentMonth.getMonth() === idx
                    ? 'bg-[#FF5A5F] text-white shadow-md'
                    : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-auto pt-3 text-center text-xs font-bold border-t border-slate-200">
        {date ? <span className="text-[#FF5A5F]">Seleccionado: {date}</span> : <span className="text-slate-500">Seleccione una fecha...</span>}
      </div>
    </div>
  );
};

