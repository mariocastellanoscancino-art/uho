import React from 'react';
import { Empleado } from '@/types/vacaciones';

interface Props {
  empleado: Empleado;
}

export const PerfilEmpleado: React.FC<Props> = ({ empleado }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        {/* Icono del cohete */}
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.944 4.293c-2.312-2.312-6.576-2.312-8.888 0-2.312 2.312-2.312 6.576 0 8.888l1.5 1.5L7.5 16.5l-1.5-1.5c-1.125-1.125-1.125-2.944 0-4.069 1.125-1.125 2.944-1.125 4.069 0l1.931 1.931 1.931-1.931c1.125-1.125 2.944-1.125 4.069 0 1.125 1.125 1.125 2.944 0 4.069L16.5 16.5l1.944 1.944 1.5-1.5c2.312-2.312 2.312-6.576 0-8.888-2.312-2.312-6.576-2.312-8.888 0L12 9.056l-.056-.056z" />
            <path d="M6 18a2 2 0 11-4 0 2 2 0 014 0zM22 18a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
          {empleado.departamento}
        </span>
      </div>
      
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Bienvenido {empleado.nombre} {empleado.apellidos}
      </h1>
    </div>
  );
};