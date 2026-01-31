import React, { useState } from 'react';
import { useUsuario, usuariosEjemplo } from '@/context/UsuarioContext';

export const SelectorUsuario: React.FC = () => {
  const { usuarioActual, cambiarUsuario } = useUsuario();
  const [isOpen, setIsOpen] = useState(false);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'colaborador':
        return 'bg-blue-100 text-blue-800';
      case 'encargado_area':
        return 'bg-green-100 text-green-800';
      case 'jefe_encargado':
        return 'bg-purple-100 text-purple-800';
      case 'recursos_humanos':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'colaborador':
        return 'Colaborador';
      case 'encargado_area':
        return 'Encargado de Área';
      case 'jefe_encargado':
        return 'Jefe del Encargado';
      case 'recursos_humanos':
        return 'Recursos Humanos';
      default:
        return tipo;
    }
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 border-2 border-blue-500"
        title="Cambiar usuario de prueba"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-sm font-medium">
          Cambiar Usuario
        </span>
        <svg className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel desplegable */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-boxdark rounded-lg shadow-xl border border-gray-200 dark:border-strokedark p-4 w-80 z-50">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-3">
              🔄 Cambiar Usuario (Demo)
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {usuariosEjemplo.map((usuario) => (
                <button
                  key={usuario.id}
                  onClick={() => {
                    cambiarUsuario(usuario);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    usuarioActual?.id === usuario.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {usuario.nombre} {usuario.apellidos}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {usuario.departamento}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTipoColor(usuario.tipo)}`}>
                      {getTipoLabel(usuario.tipo)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selecciona un usuario para probar diferentes roles y permisos
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};