import React from 'react';
import { Empleado } from '@/types/vacaciones';

interface Props {
  empleado: Empleado;
  solicitudesPendientes: number;
}

export const TarjetasEstadisticasPersonales: React.FC<Props> = ({ 
  empleado, 
  solicitudesPendientes 
}) => {
  // Calcular antigüedad en años
  const calcularAntiguedad = (fechaIngreso: Date): number => {
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    const diffTime = Math.abs(hoy.getTime() - ingreso.getTime());
    const años = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    return años;
  };

  const antigüedad = calcularAntiguedad(empleado.fechaIngreso);

  // Formatear periodo de vacaciones
  const obtenerPeriodoVacaciones = () => {
    const fechaIngreso = new Date(empleado.fechaIngreso);
    const añoActual = new Date().getFullYear();
    const mesIngreso = fechaIngreso.getMonth();
    
    if (mesIngreso <= 4) { // Mayo o antes
      return `May ${añoActual} - May ${añoActual + 1}`;
    } else {
      return `May ${añoActual} - May ${añoActual + 1}`;
    }
  };

  // Determinar el color y mensaje basado en días disponibles
  const getDiasDisponiblesInfo = () => {
    const diasDisponibles = empleado.diasVacacionesDisponibles;
    
    if (diasDisponibles <= 0) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        subtitle: '¡Sin días disponibles!',
        borderColor: 'border-red-200 dark:border-red-800'
      };
    } else if (diasDisponibles <= 5) {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        subtitle: `De ${empleado.diasVacacionesAnuales} días totales`,
        borderColor: 'border-orange-200 dark:border-orange-800'
      };
    } else {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        subtitle: `De ${empleado.diasVacacionesAnuales} días totales`,
        borderColor: 'border-green-200 dark:border-green-800'
      };
    }
  };

  const diasInfo = getDiasDisponiblesInfo();

  const cards = [
    {
      title: 'Días disponibles',
      value: empleado.diasVacacionesDisponibles,
      subtitle: diasInfo.subtitle,
      period: obtenerPeriodoVacaciones(),
      color: diasInfo.color,
      bgColor: diasInfo.bgColor,
      borderColor: diasInfo.borderColor,
    },
    {
      title: 'Días disfrutados',
      value: empleado.diasVacacionesUsados,
      subtitle: '',
      period: '',
      color: 'text-blue-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      title: 'Solicitudes pendientes',
      value: solicitudesPendientes,
      subtitle: 'Esperando aprobación',
      period: '',
      color: 'text-orange-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      title: 'Antigüedad',
      value: antigüedad,
      subtitle: 'Años',
      period: '',
      color: 'text-purple-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
  ];

  return (
    <div className="mb-8">
      {/* Título de sección */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Mis vacaciones
        </h2>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-2xl border ${
              card.borderColor || 'border-gray-100 dark:border-strokedark'
            } ${index === 0 && empleado.diasVacacionesDisponibles <= 0 ? 'ring-2 ring-red-200 dark:ring-red-800' : ''} dark:bg-boxdark`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {card.title}
              </h3>
              <div className={`text-3xl font-bold ${card.color} dark:text-white`}>
                {card.value}
                {index === 0 && empleado.diasVacacionesDisponibles <= 0 && (
                  <span className="ml-2 text-lg">⚠️</span>
                )}
              </div>
              {card.subtitle && (
                <div className={`text-sm mt-1 ${
                  index === 0 && empleado.diasVacacionesDisponibles <= 0 
                    ? 'text-red-600 dark:text-red-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {card.subtitle}
                </div>
              )}
              {card.period && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {card.period}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};