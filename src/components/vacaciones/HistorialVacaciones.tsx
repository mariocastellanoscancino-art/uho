import React, { useState } from 'react';
import { SolicitudVacaciones, Empleado } from '@/types/vacaciones';

interface Props {
  solicitudes: SolicitudVacaciones[];
  empleados: Empleado[];
}

export const HistorialVacaciones: React.FC<Props> = ({
  solicitudes,
  empleados
}) => {
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'aprobado' | 'rechazado'>('todos');
  const [ordenPor, setOrdenPor] = useState<'fecha' | 'empleado'>('fecha');

  const getEmpleadoNombre = (empleadoId: string) => {
    const empleado = empleados.find(e => e.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'Empleado no encontrado';
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

  // Filtrar solicitudes procesadas (no pendientes)
  const solicitudesProcesadas = solicitudes.filter(s => s.estado !== 'pendiente');

  // Aplicar filtros
  const solicitudesFiltradas = solicitudesProcesadas
    .filter(s => filtroEstado === 'todos' || s.estado === filtroEstado)
    .sort((a, b) => {
      if (ordenPor === 'fecha') {
        return new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime();
      } else {
        return getEmpleadoNombre(a.empleadoId).localeCompare(getEmpleadoNombre(b.empleadoId));
      }
    });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rechazado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return estado;
    }
  };

  const estadisticas = {
    total: solicitudesProcesadas.length,
    aprobadas: solicitudesProcesadas.filter(s => s.estado === 'aprobado').length,
    rechazadas: solicitudesProcesadas.filter(s => s.estado === 'rechazado').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de vacaciones</h2>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
        
        <div>
          <select
            value={ordenPor}
            onChange={(e) => setOrdenPor(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="fecha">Fecha de solicitud</option>
            <option value="empleado">Nombre del empleado</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      {solicitudesFiltradas.length === 0 ? (
        <div className="bg-white dark:bg-boxdark rounded-2xl p-8 text-center border border-gray-100 dark:border-strokedark">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay solicitudes en el historial
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filtroEstado === 'todos' ? 
              'No se encontraron solicitudes procesadas.' : 
              `No se encontraron solicitudes ${filtroEstado}s.`}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-boxdark rounded-xl border border-gray-100 dark:border-strokedark overflow-hidden">
          {/* Header de la tabla */}
          <div className="grid grid-cols-9 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID Empleado</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nombre</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Puesto</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Departamento</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Período</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Hábiles</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Motivo</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Comentarios</div>
          </div>

          {/* Filas de la tabla */}
          {solicitudesFiltradas.map((solicitud, index) => {
            const empleado = empleados.find(e => e.id === solicitud.empleadoId);
            return (
              <div key={solicitud.id} className={`grid grid-cols-9 gap-4 p-4 text-sm ${index % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-50/50 dark:bg-gray-800/50'} border-b border-gray-100 dark:border-gray-700 last:border-b-0`}>
                <div className="text-blue-600 font-medium">
                  {empleado?.numeroEmpleado || `EMP-${empleado?.id || 'N/A'}`}
                </div>
                <div className="text-gray-900 dark:text-white">
                  {empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'N/A'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {empleado?.departamento === 'TI' ? 'Analista QA' : 
                   empleado?.departamento === 'Desarrollo' ? 'Ejecutivo de desarrollo' :
                   empleado?.departamento === 'Diseño' ? 'Diseñador' : 
                   empleado?.departamento === 'Recursos Humanos' ? 'Especialista RH' :
                   empleado?.departamento === 'Tecnología' ? 'Científico de datos' : 'N/A'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {empleado?.departamento || 'N/A'}
                </div>
                <div className="text-gray-900 dark:text-white">
                  {formatFecha(solicitud.fechaInicio)} de {solicitud.fechaInicio instanceof Date ? solicitud.fechaInicio.getFullYear() : '2026'}
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {calcularDias(solicitud.fechaInicio, solicitud.fechaFin)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {solicitud.motivo}
                </div>
                <div className="flex items-center">
                  {solicitud.estado === 'aprobado' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      ✓ Aprobada
                    </span>
                  )}
                  {solicitud.estado === 'rechazado' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      ✗ Rechazada
                    </span>
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  {solicitud.comentariosAprobador || '-'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};