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

  const cards = [
    {
      title: 'Días disponibles',
      value: empleado.diasVacacionesDisponibles,
      subtitle: `De ${empleado.diasVacacionesAnuales} días totales`,
      period: obtenerPeriodoVacaciones(),
      color: 'text-green-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
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
        <div className="w-6 h-6 bg-gray-300 rounded mr-3 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Mis vacaciones
        </h2>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-2xl border border-gray-100 dark:border-strokedark dark:bg-boxdark`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {card.title}
              </h3>
              <div className={`text-3xl font-bold ${card.color} dark:text-white`}>
                {card.value}
              </div>
              {card.subtitle && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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