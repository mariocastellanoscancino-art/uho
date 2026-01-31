import React from 'react';

interface Props {
  onClose: () => void;
}

export const InstruccionesPrueba: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-boxdark rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🎯 Guía de Pruebas del Sistema
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Cambiar de Usuario */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              🔄 Cambiar de Usuario
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
              Para probar diferentes roles, haz clic en el <strong>botón azul flotante</strong> en la esquina superior derecha.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-sm"><strong>María García</strong> - Colaborador (solo sus vacaciones)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm"><strong>Carlos López</strong> - Encargado de Área (puede aprobar)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-sm"><strong>Ana Martínez</strong> - Jefe del Encargado (supervisión amplia)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-sm"><strong>Luis Rodríguez</strong> - RRHH (visibilidad total)</span>
              </div>
            </div>
          </div>

          {/* Flujo de Prueba */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
              📝 Flujo de Prueba Completo
            </h3>
            <div className="space-y-3 text-green-800 dark:text-green-200 text-sm">
              <div className="flex items-start gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <div>
                  <strong>Como Colaborador (María):</strong> Ve a "Mis vacaciones" → Haz clic en "Nueva solicitud" → Selecciona días en el calendario → Crea la solicitud
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <div>
                  <strong>Cambiar a Supervisor (Carlos):</strong> Ve a la pestaña "Solicitudes" → Verás la solicitud pendiente de María → Puedes aprobarla o rechazarla
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <div>
                  <strong>Ver Actualización:</strong> La solicitud se actualiza en tiempo real en todas las pestañas (Historial, Personal, etc.)
                </div>
              </div>
            </div>
          </div>

          {/* Funcionalidades por Pestaña */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
              📊 Funcionalidades por Pestaña
            </h3>
            <div className="space-y-2 text-yellow-800 dark:text-yellow-200 text-sm">
              <div><strong>Mis vacaciones:</strong> Estadísticas personales y crear nuevas solicitudes</div>
              <div><strong>Solicitudes:</strong> Aprobar/rechazar solicitudes del equipo (solo supervisores)</div>
              <div><strong>Historial:</strong> Ver todas las solicitudes procesadas con filtros</div>
              <div><strong>Personal:</strong> Información del equipo bajo tu supervisión</div>
              <div><strong>Calendario:</strong> Vista general (en desarrollo)</div>
            </div>
          </div>

          {/* Notas Importantes */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-300 mb-2 flex items-center gap-2">
              💡 Notas Importantes
            </h3>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
              <li>• Los datos son simulados y se actualizan en tiempo real</li>
              <li>• Cada rol ve diferentes opciones y datos según sus permisos</li>
              <li>• Las solicitudes aprobadas/rechazadas se reflejan inmediatamente</li>
              <li>• Puedes crear múltiples solicitudes y cambiar de usuario para aprobarlas</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};