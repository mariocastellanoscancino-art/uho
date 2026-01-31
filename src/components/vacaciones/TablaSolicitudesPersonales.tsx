import React from 'react';
import { SolicitudVacaciones, Empleado, EstadoSolicitud } from '@/types/vacaciones';

interface Props {
  solicitudes: SolicitudVacaciones[];
  empleados: Empleado[];
  empleadoActual?: Empleado;
  onEliminar?: (solicitudId: string) => void;
  loading?: boolean;
}

export const TablaSolicitudesPersonales: React.FC<Props> = ({
  solicitudes,
  empleados,
  empleadoActual,
  onEliminar,
  loading = false
}) => {
  // Filtrar solicitudes del empleado actual si está definido
  const solicitudesFiltradas = empleadoActual 
    ? solicitudes.filter(s => s.empleadoId === empleadoActual.id)
    : solicitudes;

  const getEstadoColor = (estado: EstadoSolicitud): string => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoTexto = (estado: EstadoSolicitud): string => {
    switch (estado) {
      case 'aprobado':
        return 'Aprobada';
      case 'rechazado':
        return 'Rechazada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  const formatearFecha = (fecha: Date): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearPeriodo = (fechaInicio: Date, fechaFin: Date): string => {
    return `${formatearFecha(fechaInicio)} de ${new Date(fechaInicio).getFullYear()}`;
  };

  if (solicitudesFiltradas.length === 0) {
    return (
      <div className="bg-white dark:bg-boxdark rounded-2xl p-8 text-center border border-gray-100 dark:border-strokedark">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay solicitudes de vacaciones
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Cuando crees solicitudes aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-boxdark rounded-2xl border border-gray-100 dark:border-strokedark overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-strokedark">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded mr-3 flex items-center justify-center">
            <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mis solicitudes de vacaciones
          </h3>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Días Hábiles
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Motivo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Solicitud
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Comentarios
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-strokedark">
            {solicitudesFiltradas.map((solicitud, index) => (
              <tr key={solicitud.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  {solicitud.estado === 'pendiente' && onEliminar && (
                    <button
                      onClick={() => onEliminar(solicitud.id)}
                      disabled={loading}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Eliminar solicitud"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  {solicitud.estado !== 'pendiente' && (
                    <div className="w-5 h-5"></div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatearFecha(solicitud.fechaInicio)} al {formatearFecha(solicitud.fechaFin)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {solicitud.diasSolicitados}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {solicitud.motivo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(solicitud.estado)}`}>
                    {solicitud.estado === 'pendiente' && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {solicitud.estado === 'aprobado' && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {solicitud.estado === 'rechazado' && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {getEstadoTexto(solicitud.estado)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {solicitud.comentariosAprobador || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};