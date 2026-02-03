import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
  loading?: boolean;
  solicitudId: string;
}

export const ModalCancelarSolicitud: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  solicitudId
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setMotivo('');
    setError('');
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo.trim()) {
      setError('El motivo de cancelación es obligatorio');
      return;
    }

    try {
      await onConfirm(motivo.trim());
      resetForm();
      onClose();
    } catch (error) {
      setError('Error al cancelar la solicitud');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 transition-opacity z-[999998]"
        style={{ 
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 z-[999999] relative">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all z-[999999]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Cancelar Solicitud de Vacaciones
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Indique el motivo de la cancelación
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
            {/* Advertencia */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">⚠️ Confirmar cancelación</h3>
              <div className="text-sm">
                <p className="text-blue-700">
                  Esta acción eliminará permanentemente la solicitud y devolverá los días de vacaciones a su cuenta.
                </p>
              </div>
            </div>

            {/* Campo de motivo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la cancelación *
              </label>
              <textarea
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Explique por qué está cancelando esta solicitud de vacaciones..."
                rows={4}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
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
                Mantener solicitud
              </button>
              
              <button
                type="submit"
                disabled={loading || !motivo.trim()}
                className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Confirmar cancelación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};