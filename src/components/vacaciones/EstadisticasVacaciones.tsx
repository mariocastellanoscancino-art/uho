import React from 'react';
import { VacacionesStats } from '@/types/vacaciones';

interface Props {
  estadisticas: VacacionesStats;
}

export const EstadisticasVacaciones: React.FC<Props> = ({ estadisticas }) => {
  const cards = [
    {
      title: 'Total Empleados',
      value: estadisticas.totalEmpleados,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-primary',
      textColor: 'text-primary'
    },
    {
      title: 'Solicitudes Pendientes',
      value: estadisticas.solicitudesPendientes,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-meta-6',
      textColor: 'text-meta-6'
    },
    {
      title: 'Vacaciones Aprobadas',
      value: estadisticas.vacacionesAprobadas,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-meta-3',
      textColor: 'text-meta-3'
    },
    {
      title: 'Promedio Días/Empleado',
      value: estadisticas.diasPromedioPorEmpleado,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-meta-5',
      textColor: 'text-meta-5'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${card.color}`}>
            <div className="text-white">
              {card.icon}
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {card.value}
              </h4>
              <span className="text-sm font-medium text-gray-500">{card.title}</span>
            </div>

            <span className={`flex items-center gap-1 text-sm font-medium ${card.textColor}`}>
              {typeof card.value === 'number' && card.value > 0 && (
                <svg
                  className="fill-current"
                  width="10"
                  height="11"
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                    fill=""
                  />
                </svg>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};