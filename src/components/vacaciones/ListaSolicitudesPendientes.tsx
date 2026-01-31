import React from 'react';
import { SolicitudVacaciones, Empleado } from '@/types/vacaciones';

interface Props {
  solicitudes: SolicitudVacaciones[];
  empleados: Empleado[];
  onAprobar: (solicitudId: string) => void;
  onRechazar: (solicitudId: string, motivo: string) => void;
  loading?: boolean;
}

export const ListaSolicitudesPendientes: React.FC<Props> = ({
  solicitudes,
  empleados,
  onAprobar,
  onRechazar,
  loading = false
}) => {
  const [motivosRechazo, setMotivosRechazo] = React.useState<Record<string, string>>({});
  const [mostrarMotivo, setMostrarMotivo] = React.useState<Record<string, boolean>>({});

  const getEmpleadoNombre = (empleadoId: string) => {
    const empleado = empleados.find(e => e.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'Empleado no encontrado';
  };

  const getEmpleadoDepartamento = (empleadoId: string) => {
    const empleado = empleados.find(e => e.id === empleadoId);
    return empleado?.departamento || '';
  };

  const formatFecha = (fecha: string | Date) => {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calcularDias = (fechaInicio: string | Date, fechaFin: string | Date) => {
    const inicio = typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio;
    const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24)) + 1;
  };

  const handleRechazar = (solicitudId: string) => {
    const motivo = motivosRechazo[solicitudId] || '';
    if (!motivo.trim()) {
      alert('Por favor, ingrese un motivo para el rechazo');
      return;
    }
    onRechazar(solicitudId, motivo);
    setMostrarMotivo(prev => ({ ...prev, [solicitudId]: false }));
    setMotivosRechazo(prev => ({ ...prev, [solicitudId]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <h2 className="text-lg font-semibold">Solicitudes pendientes de aprobación</h2>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        📅→ Arrastra las solicitudes no asignadas a tu equipo
      </p>

      {solicitudes.length === 0 ? (
        <div className="bg-white dark:bg-boxdark rounded-2xl p-8 text-center border border-gray-100 dark:border-strokedark">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay solicitudes pendientes
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Todas las solicitudes han sido procesadas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((solicitud) => (
            <div
              key={solicitud.id}
              className="bg-white dark:bg-boxdark rounded-xl p-6 border border-gray-100 dark:border-strokedark shadow-sm"
            >
              {/* Header con empleado */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {getEmpleadoNombre(solicitud.empleadoId).split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getEmpleadoDepartamento(solicitud.empleadoId)}
                    </p>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {getEmpleadoNombre(solicitud.empleadoId)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Información de la solicitud */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Período</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatFecha(solicitud.fechaInicio)} de mar 2026
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Días solicitado</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {calcularDias(solicitud.fechaInicio, solicitud.fechaFin)} días hábiles
                  </p>
                </div>
                <div></div>
              </div>

              <div className="mb-4">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Motivo:</span>
                <p className="text-gray-900 dark:text-white">{solicitud.motivo}</p>
              </div>

              <div className="mb-6">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Comentarios</span>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {solicitud.comentariosAprobador || 'Sin comentarios'}
                  </p>
                </div>
              </div>

              {/* Motivo de rechazo si está visible */}
              {mostrarMotivo[solicitud.id] && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Motivo del rechazo *
                  </label>
                  <textarea
                    value={motivosRechazo[solicitud.id] || ''}
                    onChange={(e) => setMotivosRechazo(prev => ({
                      ...prev,
                      [solicitud.id]: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Explique el motivo del rechazo..."
                  />
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3">
                {!mostrarMotivo[solicitud.id] ? (
                  <>
                    <button
                      onClick={() => onAprobar(solicitud.id)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-green-700 bg-white border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Aprobar
                    </button>
                    <button
                      onClick={() => setMostrarMotivo(prev => ({ ...prev, [solicitud.id]: true }))}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-700 bg-white border-2 border-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rechazar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleRechazar(solicitud.id)}
                      disabled={loading || !motivosRechazo[solicitud.id]?.trim()}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirmar Rechazo
                    </button>
                    <button
                      onClick={() => {
                        setMostrarMotivo(prev => ({ ...prev, [solicitud.id]: false }));
                        setMotivosRechazo(prev => ({ ...prev, [solicitud.id]: '' }));
                      }}
                      disabled={loading}
                      className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};