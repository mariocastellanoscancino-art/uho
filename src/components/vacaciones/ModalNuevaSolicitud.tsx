import React, { useState } from 'react';
import { CalendarioSelectorDias } from './CalendarioSelectorDias';
import { Empleado } from '@/types/vacaciones';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  empleado: Empleado;
  onSubmit: (datos: {
    fechasSeleccionadas: Date[];
    motivo: string;
  }) => Promise<void>;
  loading?: boolean;
}

export const ModalNuevaSolicitud: React.FC<Props> = ({
  isOpen,
  onClose,
  empleado,
  onSubmit,
  loading = false
}) => {
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<Date[]>([]);
  const [motivo, setMotivo] = useState('');
  const [errors, setErrors] = useState<{fechas?: string, motivo?: string}>({});
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const resetForm = () => {
    setFechasSeleccionadas([]);
    setMotivo('');
    setErrors({});
    setMostrarCalendario(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatFechasParaInput = () => {
    if (fechasSeleccionadas.length === 0) return '';
    
    if (fechasSeleccionadas.length === 1) {
      return fechasSeleccionadas[0].toLocaleDateString('es-ES');
    }
    
    const sortedDates = [...fechasSeleccionadas].sort((a, b) => a.getTime() - b.getTime());
    const primera = sortedDates[0].toLocaleDateString('es-ES');
    const ultima = sortedDates[sortedDates.length - 1].toLocaleDateString('es-ES');
    
    return `${primera} - ${ultima} (${fechasSeleccionadas.length} días)`;
  };

  const validarFormulario = () => {
    const newErrors: {fechas?: string, motivo?: string} = {};

    if (fechasSeleccionadas.length === 0) {
      newErrors.fechas = 'Debe seleccionar al menos un día';
    }

    if (fechasSeleccionadas.length > empleado.diasVacacionesDisponibles) {
      newErrors.fechas = `No puede seleccionar más de ${empleado.diasVacacionesDisponibles} días disponibles`;
    }

    if (!motivo.trim()) {
      newErrors.motivo = 'El motivo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      await onSubmit({
        fechasSeleccionadas,
        motivo: motivo.trim()
      });
      
      resetForm();
      onClose();
    } catch (error) {
      // El error será manejado por el componente padre
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Nueva Solicitud de Vacaciones
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Complete el formulario para solicitar los días de vacaciones
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Información del empleado */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Información</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Empleado:</span>
                  <span className="ml-2 font-medium">{empleado.nombre} {empleado.apellidos}</span>
                </div>
                <div>
                  <span className="text-blue-700">Días disponibles:</span>
                  <span className="ml-2 font-medium text-blue-600">{empleado.diasVacacionesDisponibles}</span>
                </div>
              </div>
            </div>

            {/* Campo de fecha */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la solicitud
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={formatFechasParaInput()}
                  onClick={() => setMostrarCalendario(!mostrarCalendario)}
                  placeholder="DD/MM/AAAA"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fechas ? 'border-red-500' : ''
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.fechas && (
                <p className="text-red-500 text-sm mt-1">{errors.fechas}</p>
              )}
            </div>

            {/* Calendario */}
            {mostrarCalendario && (
              <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <CalendarioSelectorDias
                  selectedDates={fechasSeleccionadas}
                  onDateSelect={setFechasSeleccionadas}
                  minDate={new Date()}
                  diasFestivos={[]} // Se pueden agregar días festivos personalizados aquí
                />
              </div>
            )}

            {/* Campo de motivo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la solicitud
              </label>
              <textarea
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  if (errors.motivo) {
                    setErrors(prev => ({ ...prev, motivo: undefined }));
                  }
                }}
                placeholder="Describa el motivo de su solicitud..."
                rows={4}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.motivo ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {errors.motivo && (
                <p className="text-red-500 text-sm mt-1">{errors.motivo}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading || fechasSeleccionadas.length === 0}
                className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};