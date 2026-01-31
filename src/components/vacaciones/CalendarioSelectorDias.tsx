import React, { useState } from 'react';

interface Props {
  selectedDates: Date[];
  onDateSelect: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  diasFestivos?: Date[]; // Días festivos personalizables
}

export const CalendarioSelectorDias: React.FC<Props> = ({
  selectedDates,
  onDateSelect,
  minDate = new Date(),
  maxDate,
  diasFestivos = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Días festivos de México para 2026
  const diasFestivosPredeterminados = [
    new Date(2026, 0, 1),   // Año Nuevo
    new Date(2026, 1, 3),   // Día de la Constitución (primer lunes de febrero)
    new Date(2026, 2, 17),  // Natalicio de Benito Juárez (tercer lunes de marzo)
    new Date(2026, 3, 17),  // Jueves Santo
    new Date(2026, 3, 18),  // Viernes Santo
    new Date(2026, 4, 1),   // Día del Trabajo
    new Date(2026, 8, 16),  // Día de la Independencia
    new Date(2026, 10, 17), // Día de la Revolución Mexicana (tercer lunes de noviembre)
    new Date(2026, 11, 25), // Navidad
  ];

  // Combinar días festivos predeterminados con los personalizados
  const todosDiasFestivos = [...diasFestivosPredeterminados, ...diasFestivos];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Agregar días vacíos del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Agregar días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const isDateSelected = (date: Date | null) => {
    if (!date) return false;
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const isWeekend = (date: Date | null) => {
    if (!date) return false;
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Domingo o Sábado
  };

  const isDiaFestivo = (date: Date | null) => {
    if (!date) return false;
    return todosDiasFestivos.some(festivo => 
      festivo.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    
    // Solo deshabilitar fechas pasadas
    if (date < minDate) return true;
    
    // No permitir fechas después del máximo
    if (maxDate && date > maxDate) return true;
    
    // Ya no deshabilitamos fines de semana ni días festivos
    return false;
  };

  const getDayTypeClass = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return '';
    
    if (isDateSelected(date)) {
      return 'bg-blue-600 text-white hover:bg-blue-700';
    } else {
      return 'text-gray-900 hover:bg-blue-50';
    }
  };

  const handleDateClick = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return;

    const dateString = date.toDateString();
    const isAlreadySelected = selectedDates.some(selectedDate => 
      selectedDate.toDateString() === dateString
    );

    let newSelectedDates: Date[];
    if (isAlreadySelected) {
      // Remover fecha si ya está seleccionada
      newSelectedDates = selectedDates.filter(selectedDate => 
        selectedDate.toDateString() !== dateString
      );
    } else {
      // Agregar fecha a la selección
      newSelectedDates = [...selectedDates, date];
    }

    onDateSelect(newSelectedDates);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((date, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDateClick(date)}
            disabled={isDateDisabled(date)}
            className={`
              aspect-square p-2 text-sm rounded-lg transition-colors
              ${!date ? 'invisible' : ''}
              ${isDateDisabled(date) 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'cursor-pointer'
              }
              ${getDayTypeClass(date)}
            `}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>

      {/* Fechas seleccionadas */}
      {selectedDates.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Días seleccionados ({selectedDates.length}):
          </h4>
          <div className="flex flex-wrap gap-1">
            {selectedDates
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                >
                  {formatDateForDisplay(date)}
                  <button
                    type="button"
                    onClick={() => handleDateClick(date)}
                    className="ml-1 hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
          
          {/* Resumen de tipos de días */}
          <div className="mt-3 pt-2 border-t border-blue-200">
            <div className="grid grid-cols-3 gap-2 text-xs text-blue-700">
              <div>
                <span className="font-medium">
                  Días hábiles: {selectedDates.filter(date => !isWeekend(date) && !isDiaFestivo(date)).length}
                </span>
              </div>
              <div>
                <span className="font-medium">
                  Fines de semana: {selectedDates.filter(date => isWeekend(date) && !isDiaFestivo(date)).length}
                </span>
              </div>
              <div>
                <span className="font-medium">
                  Días festivos: {selectedDates.filter(date => isDiaFestivo(date)).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};