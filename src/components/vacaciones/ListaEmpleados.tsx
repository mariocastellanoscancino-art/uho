import React from 'react';
import { Empleado } from '@/types/vacaciones';

interface Props {
  empleados: Empleado[];
}

export const ListaEmpleados: React.FC<Props> = ({ empleados }) => {
  const formatearFecha = (fecha: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(fecha));
  };

  const calcularAntiguedad = (fechaIngreso: Date): string => {
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    const diffTime = Math.abs(hoy.getTime() - ingreso.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const años = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);
    
    if (años > 0) {
      return `${años} año${años > 1 ? 's' : ''} ${meses > 0 ? `y ${meses} mes${meses > 1 ? 'es' : ''}` : ''}`;
    } else {
      return `${meses} mes${meses > 1 ? 'es' : ''}`;
    }
  };

  const getColorDisponibilidad = (disponibles: number, total: number): string => {
    const porcentaje = (disponibles / total) * 100;
    if (porcentaje >= 70) return 'text-meta-3'; // Verde
    if (porcentaje >= 30) return 'text-meta-6'; // Amarillo
    return 'text-meta-1'; // Rojo
  };

  if (empleados.length === 0) {
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="text-lg font-medium">No hay empleados registrados</h3>
            <p className="text-sm">Los empleados aparecerán aquí cuando sean agregados al sistema</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Empleados ({empleados.length})
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
                Departamento
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Fecha Ingreso
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Antigüedad
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Días Anuales
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Días Usados
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Días Disponibles
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Progreso
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id} className="border-b border-stroke dark:border-strokedark">
                <td className="py-5 px-4 pl-9 xl:pl-11">
                  <div className="font-medium text-black dark:text-white">
                    {empleado.nombre} {empleado.apellidos}
                  </div>
                  <div className="text-sm text-gray-500">
                    {empleado.email}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="text-black dark:text-white">
                    {empleado.departamento}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="text-black dark:text-white">
                    {formatearFecha(empleado.fechaIngreso)}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="text-black dark:text-white text-sm">
                    {calcularAntiguedad(empleado.fechaIngreso)}
                  </div>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {empleado.diasVacacionesAnuales}
                  </span>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-8 rounded-full bg-meta-1/10 text-meta-1 text-sm font-medium">
                    {empleado.diasVacacionesUsados}
                  </span>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className={`inline-flex items-center justify-center w-10 h-8 rounded-full bg-meta-3/10 text-sm font-medium ${getColorDisponibilidad(empleado.diasVacacionesDisponibles, empleado.diasVacacionesAnuales)}`}>
                    {empleado.diasVacacionesDisponibles}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        {Math.round((empleado.diasVacacionesUsados / empleado.diasVacacionesAnuales) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((empleado.diasVacacionesUsados / empleado.diasVacacionesAnuales) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{empleado.diasVacacionesUsados} usados</span>
                      <span>{empleado.diasVacacionesDisponibles} disponibles</span>
                    </div>
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