import React, { useState } from 'react';
import { FormularioVacaciones, Empleado } from '@/types/vacaciones';

interface Props {
  empleados: Empleado[];
  onSubmit: (formulario: FormularioVacaciones) => Promise<void>;
  loading: boolean;
  onCancel?: () => void;
}

export const FormularioSolicitudVacaciones: React.FC<Props> = ({
  empleados,
  onSubmit,
  loading,
  onCancel
}) => {
  const [formulario, setFormulario] = useState<FormularioVacaciones>({
    empleadoId: '',
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
  });

  const [errors, setErrors] = useState<Partial<FormularioVacaciones>>({});

  const empleadoSeleccionado = empleados.find(emp => emp.id === formulario.empleadoId);

  const validarFormulario = (): boolean => {
    const newErrors: Partial<FormularioVacaciones> = {};

    if (!formulario.empleadoId) {
      newErrors.empleadoId = 'Debe seleccionar un empleado';
    }

    if (!formulario.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formulario.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    }

    if (formulario.fechaInicio && formulario.fechaFin) {
      const inicio = new Date(formulario.fechaInicio);
      const fin = new Date(formulario.fechaFin);
      
      if (inicio > fin) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }

      if (inicio < new Date()) {
        newErrors.fechaInicio = 'La fecha de inicio no puede ser anterior a hoy';
      }
    }

    if (!formulario.motivo.trim()) {
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
      await onSubmit(formulario);
      // Resetear formulario después de envío exitoso
      setFormulario({
        empleadoId: '',
        fechaInicio: '',
        fechaFin: '',
        motivo: '',
      });
      setErrors({});
    } catch (error) {
      // El error será manejado por el componente padre
    }
  };

  const handleChange = (field: keyof FormularioVacaciones, value: string) => {
    setFormulario(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Nueva Solicitud de Vacaciones
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Empleado <span className="text-meta-1">*</span>
          </label>
          <select
            value={formulario.empleadoId}
            onChange={(e) => handleChange('empleadoId', e.target.value)}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
              errors.empleadoId ? 'border-meta-1' : ''
            }`}
            disabled={loading}
          >
            <option value="">Seleccionar empleado...</option>
            {empleados.map(empleado => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre} {empleado.apellidos} - {empleado.departamento}
              </option>
            ))}
          </select>
          {errors.empleadoId && (
            <p className="text-meta-1 text-sm mt-1">{errors.empleadoId}</p>
          )}
        </div>

        {empleadoSeleccionado && (
          <div className="mb-4.5 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-black dark:text-white mb-2">
              Información del Empleado
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Días anuales:</span>
                <span className="ml-2 font-medium">{empleadoSeleccionado.diasVacacionesAnuales}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Días usados:</span>
                <span className="ml-2 font-medium">{empleadoSeleccionado.diasVacacionesUsados}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Días disponibles:</span>
                <span className={`ml-2 font-medium ${
                  empleadoSeleccionado.diasVacacionesDisponibles > 0 
                    ? 'text-meta-3' 
                    : 'text-meta-1'
                }`}>
                  {empleadoSeleccionado.diasVacacionesDisponibles}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Departamento:</span>
                <span className="ml-2 font-medium">{empleadoSeleccionado.departamento}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Fecha de Inicio <span className="text-meta-1">*</span>
            </label>
            <input
              type="date"
              value={formulario.fechaInicio}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                errors.fechaInicio ? 'border-meta-1' : ''
              }`}
              disabled={loading}
            />
            {errors.fechaInicio && (
              <p className="text-meta-1 text-sm mt-1">{errors.fechaInicio}</p>
            )}
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Fecha de Fin <span className="text-meta-1">*</span>
            </label>
            <input
              type="date"
              value={formulario.fechaFin}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                errors.fechaFin ? 'border-meta-1' : ''
              }`}
              disabled={loading}
            />
            {errors.fechaFin && (
              <p className="text-meta-1 text-sm mt-1">{errors.fechaFin}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block text-black dark:text-white">
            Motivo <span className="text-meta-1">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describa el motivo de la solicitud de vacaciones..."
            value={formulario.motivo}
            onChange={(e) => handleChange('motivo', e.target.value)}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
              errors.motivo ? 'border-meta-1' : ''
            }`}
            disabled={loading}
          />
          {errors.motivo && (
            <p className="text-meta-1 text-sm mt-1">{errors.motivo}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Enviar Solicitud'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:bg-opacity-90 disabled:opacity-50 dark:border-strokedark dark:text-white"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};