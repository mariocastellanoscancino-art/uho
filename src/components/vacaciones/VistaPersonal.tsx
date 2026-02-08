import React, { useState } from 'react';
import { Empleado } from '@/types/vacaciones';

interface Props {
  empleados: Empleado[];
}

export const VistaPersonal: React.FC<Props> = ({ empleados }) => {
  const [busqueda, setBusqueda] = useState('');
  const [ordenPor, setOrdenPor] = useState<'nombre' | 'departamento' | 'fechaIngreso'>('nombre');

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calcularAntiguedad = (fechaIngreso: Date) => {
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    const diferencia = hoy.getTime() - ingreso.getTime();
    const años = Math.floor(diferencia / (365.25 * 24 * 60 * 60 * 1000));
    const meses = Math.floor((diferencia % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    
    if (años === 0) {
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else if (meses === 0) {
      return `${años} ${años === 1 ? 'año' : 'años'}`;
    } else {
      return `${años} ${años === 1 ? 'año' : 'años'}, ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }
  };

  // Filtrar y ordenar empleados
  const empleadosFiltrados = empleados
    .filter(emp => 
      emp.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.departamento.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.id.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      switch (ordenPor) {
        case 'nombre':
          return `${a.nombre} ${a.apellidos}`.localeCompare(`${b.nombre} ${b.apellidos}`);
        case 'departamento':
          return a.departamento.localeCompare(b.departamento);
        case 'fechaIngreso':
          return new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime();
        default:
          return 0;
      }
    });

  // Estadísticas del personal
  const estadisticas = {
    total: empleados.length,
    departamentos: [...new Set(empleados.map(e => e.departamento))].length,
    promedioVacacionesDisponibles: Math.round(
      empleados.reduce((sum, emp) => sum + emp.diasVacacionesDisponibles, 0) / empleados.length
    ),
    promedioVacacionesUsadas: Math.round(
      empleados.reduce((sum, emp) => sum + emp.diasVacacionesUsados, 0) / empleados.length
    )
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mi equipo</h2>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Miembros del equipo bajo tu supervisión
      </p>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, apellido, departamento o id"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div>
          <select
            value={ordenPor}
            onChange={(e) => setOrdenPor(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="nombre">Nombre</option>
            <option value="departamento">Departamento</option>
            <option value="fechaIngreso">Fecha de ingreso</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      {empleadosFiltrados.length === 0 ? (
        <div className="bg-white dark:bg-boxdark rounded-2xl p-8 text-center border border-gray-100 dark:border-strokedark">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron empleados
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-boxdark rounded-xl border border-gray-100 dark:border-strokedark overflow-hidden">
          {/* Header de la tabla */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID Empleado</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nombre</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Puesto</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Departamento</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase text-center">Días disponibles</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase text-center">Días Disfrutados</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase text-center">Antigüedad</div>
          </div>

          {/* Filas de la tabla */}
          {empleadosFiltrados.map((empleado, index) => (
            <div key={empleado.id} className={`grid grid-cols-7 gap-4 p-4 text-sm ${index % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-50/50 dark:bg-gray-800/50'} border-b border-gray-100 dark:border-gray-700 last:border-b-0`}>
              <div className="text-blue-600 font-medium">{empleado.numeroEmpleado || `EMP-${empleado.id}`}</div>
              <div className="text-gray-900 dark:text-white font-medium">
                {empleado.nombre} {empleado.apellidos}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {empleado.departamento === 'TI' ? 'Analista QA' : 
                 empleado.departamento === 'Desarrollo' ? 'Ejecutivo de desarrollo' :
                 empleado.departamento === 'Diseño' ? 'Diseñador' : 
                 empleado.departamento === 'Recursos Humanos' ? 'Especialista RH' :
                 empleado.departamento === 'Tecnología' ? 'Científico de datos' : 'Analista QA'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {empleado.departamento}
              </div>
              <div className="text-center font-medium text-green-600 dark:text-green-400">
                {empleado.diasVacacionesDisponibles}
              </div>
              <div className="text-center font-medium text-blue-600 dark:text-blue-400">
                {empleado.diasVacacionesUsados}
              </div>
              <div className="text-center text-gray-900 dark:text-white">
                {Math.floor((new Date().getTime() - new Date(empleado.fechaIngreso).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};