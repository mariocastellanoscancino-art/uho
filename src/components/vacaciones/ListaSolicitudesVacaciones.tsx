import React from 'react';
import { SolicitudVacaciones, Empleado, EstadoSolicitud } from '@/types/vacaciones';

interface Props {
  solicitudes: SolicitudVacaciones[];
  empleados: Empleado[];
  onAprobar?: (solicitudId: string, comentarios?: string) => void;
  onRechazar?: (solicitudId: string, comentarios: string) => void;
  loading?: boolean;
}

export const ListaSolicitudesVacaciones: React.FC<Props> = ({
  solicitudes,
  empleados,
  onAprobar,
  onRechazar,
  loading = false
}) => {
  const getEmpleadoNombre = (empleadoId: string): string => {
    const empleado = empleados.find(emp => emp.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'Empleado no encontrado';
  };

  const getEstadoColor = (estado: EstadoSolicitud): string => {
    switch (estado) {
      case 'aprobado':
        return 'bg-meta-3 text-white';
      case 'rechazado':
        return 'bg-meta-1 text-white';
      case 'pendiente':
        return 'bg-meta-6 text-white';
      case 'cancelado':
        return 'bg-meta-7 text-white';
      default:
        return 'bg-meta-4 text-white';
    }
  };

  const formatearFecha = (fecha: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(fecha));
  };

  const handleAprobar = (solicitudId: string) => {
    if (onAprobar) {
      const comentarios = prompt('Comentarios de aprobación (opcional):');
      onAprobar(solicitudId, comentarios || undefined);
    }
  };

  const handleRechazar = (solicitudId: string) => {
    if (onRechazar) {
      const comentarios = prompt('Motivo del rechazo (obligatorio):');
      if (comentarios && comentarios.trim()) {
        onRechazar(solicitudId, comentarios.trim());
      } else {
        alert('Debe proporcionar un motivo para el rechazo');
      }
    }
  };

  if (solicitudes.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium">No hay solicitudes de vacaciones</h3>
            <p className="text-sm">Cuando se creen solicitudes aparecerán aquí</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Solicitudes de Vacaciones ({solicitudes.length})
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Empleado
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Fechas
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Días
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Motivo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Estado
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Fecha Solicitud
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id} className="border-b border-stroke dark:border-strokedark">
                <td className="py-5 px-4 pl-9 xl:pl-11">
                  <div className="font-medium text-black dark:text-white">
                    {getEmpleadoNombre(solicitud.empleadoId)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {empleados.find(emp => emp.id === solicitud.empleadoId)?.departamento}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="text-black dark:text-white">
                    <div className="text-sm font-medium">
                      {formatearFecha(solicitud.fechaInicio)}
                    </div>
                    <div className="text-sm text-gray-500">
                      al {formatearFecha(solicitud.fechaFin)}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {solicitud.diasSolicitados}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-4 max-w-xs">
                  <div className="text-black dark:text-white text-sm">
                    {solicitud.motivo.length > 50 
                      ? `${solicitud.motivo.substring(0, 50)}...`
                      : solicitud.motivo
                    }
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${getEstadoColor(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                  {solicitud.comentariosAprobador && (
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">
                      {solicitud.comentariosAprobador}
                    </div>
                  )}
                </td>
                <td className="py-5 px-4">
                  <div className="text-black dark:text-white text-sm">
                    {formatearFecha(solicitud.fechaSolicitud)}
                  </div>
                  {solicitud.fechaAprobacion && (
                    <div className="text-xs text-gray-500">
                      {solicitud.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}: {formatearFecha(solicitud.fechaAprobacion)}
                    </div>
                  )}
                </td>
                <td className="py-5 px-4">
                  {solicitud.estado === 'pendiente' && (onAprobar || onRechazar) && (
                    <div className="flex items-center space-x-2">
                      {onAprobar && (
                        <button
                          onClick={() => handleAprobar(solicitud.id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center rounded-md bg-meta-3 py-2 px-3 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 text-sm"
                          title="Aprobar solicitud"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      {onRechazar && (
                        <button
                          onClick={() => handleRechazar(solicitud.id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center rounded-md bg-meta-1 py-2 px-3 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 text-sm"
                          title="Rechazar solicitud"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                  {solicitud.estado !== 'pendiente' && (
                    <span className="text-gray-400 text-sm">
                      {solicitud.aprobadoPor ? `Por: ${solicitud.aprobadoPor}` : '-'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};