"use client";

import React, { useState } from 'react';
import { useVacaciones } from '@/hooks/useVacaciones';
import { useUsuario } from '@/context/UsuarioContext';
import FirebaseStatus from '@/components/FirebaseStatus';
import {
  AlertaVacaciones,
  PerfilEmpleado,
  TarjetasEstadisticasPersonales,
  TablaSolicitudesPersonales,
  ModalNuevaSolicitud,
  ModalCancelarSolicitud,
  SelectorUsuario,
  ListaSolicitudesPendientes,
  HistorialVacaciones,
  VistaPersonal,
  InstruccionesPrueba
} from '@/components/vacaciones';

type TabType = 'mis-vacaciones' | 'solicitudes' | 'historial' | 'personal' | 'calendario';

export default function VacacionesPageContent() {
  const { usuarioActual, permisos } = useUsuario();
  const {
    empleados,
    solicitudes,
    loading,
    error,
    crearSolicitudVacaciones,
    aprobarSolicitud,
    rechazarSolicitud,
    eliminarSolicitud,
    obtenerEmpleadosVisibles,
    obtenerSolicitudesVisibles,
    obtenerSolicitudesPendientesAprobacion,
    obtenerHistorialCompleto
  } = useVacaciones(usuarioActual || undefined);

  const [tabActiva, setTabActiva] = useState<TabType>('mis-vacaciones');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [solicitudACancelar, setSolicitudACancelar] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error' | 'warning' | 'info', texto: string } | null>(null);
  const [loadingAprobacion, setLoadingAprobacion] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);

  // Obtener empleado actual
  const empleadoActual = empleados.find(emp => emp.id === usuarioActual?.id);
  
  // Obtener datos filtrados según permisos
  const empleadosVisibles = obtenerEmpleadosVisibles(usuarioActual || undefined);
  const solicitudesVisibles = obtenerSolicitudesVisibles(usuarioActual || undefined);
  const solicitudesPendientes = obtenerSolicitudesPendientesAprobacion(usuarioActual || undefined);
  const historialCompleto = obtenerHistorialCompleto(usuarioActual || undefined);

  // Calcular solicitudes pendientes del usuario actual
  const misSolicitudesPendientes = solicitudesVisibles.filter(
    s => s.empleadoId === usuarioActual?.id && s.estado === 'pendiente'
  ).length;

  const handleCrearSolicitud = async (datos: {
    fechasSeleccionadas: Date[];
    motivo: string;
  }) => {
    if (!usuarioActual || !empleadoActual) return;

    try {
      const solicitud = {
        empleadoId: usuarioActual.id,
        fechaInicio: '',
        fechaFin: '',
        motivo: datos.motivo,
        fechasSeleccionadas: datos.fechasSeleccionadas
      };
      
      await crearSolicitudVacaciones(solicitud);
      
      const finesDeSemana = datos.fechasSeleccionadas.filter(fecha => {
        const dayOfWeek = fecha.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
      }).length;
      
      let mensaje = `Solicitud creada exitosamente: ${datos.fechasSeleccionadas.length} día${datos.fechasSeleccionadas.length > 1 ? 's' : ''}`;
      
      if (finesDeSemana > 0) {
        mensaje += ` (incluye ${finesDeSemana} fin${finesDeSemana > 1 ? 'es' : ''} de semana)`;
      }
      
      setMensaje({ tipo: 'success', texto: mensaje });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'Error al crear la solicitud'
      });
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleEliminarSolicitud = (solicitudId: string) => {
    setSolicitudACancelar(solicitudId);
    setModalCancelarAbierto(true);
  };

  const handleConfirmarCancelacion = async (motivo: string) => {
    if (!solicitudACancelar) return;

    try {
      await eliminarSolicitud(solicitudACancelar, motivo);
      setMensaje({ 
        tipo: 'success', 
        texto: '❌ Solicitud cancelada exitosamente. Los días han sido devueltos a su cuenta.' 
      });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'Error al cancelar la solicitud'
      });
      setTimeout(() => setMensaje(null), 5000);
    } finally {
      setSolicitudACancelar(null);
      setModalCancelarAbierto(false);
    }
  };

  const handleAprobarSolicitud = async (solicitudId: string) => {
    try {
      setLoadingAprobacion(true);
      await aprobarSolicitud(solicitudId);
      
      setMensaje({ 
        tipo: 'success', 
        texto: '✅ Solicitud aprobada exitosamente' 
      });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'Error al aprobar la solicitud'
      });
      setTimeout(() => setMensaje(null), 5000);
    } finally {
      setLoadingAprobacion(false);
    }
  };

  const handleRechazarSolicitud = async (solicitudId: string, motivo: string) => {
    try {
      setLoadingAprobacion(true);
      await rechazarSolicitud(solicitudId, motivo);
      
      setMensaje({ 
        tipo: 'success', 
        texto: '❌ Solicitud rechazada exitosamente' 
      });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'Error al rechazar la solicitud'
      });
      setTimeout(() => setMensaje(null), 5000);
    } finally {
      setLoadingAprobacion(false);
    }
  };

  // Definir pestañas según permisos
  const tabs = [
    { id: 'mis-vacaciones', label: 'Mis vacaciones', visible: true },
    { 
      id: 'solicitudes', 
      label: 'Solicitudes', 
      visible: permisos.aprobarRechazarEquipo || permisos.consultarSolicitudesPendientes 
    },
    { id: 'historial', label: 'Historial', visible: permisos.consultarHistorialArea || permisos.visibilidadTotal },
    { id: 'personal', label: 'Personal', visible: permisos.consultarInformacionPersonal || permisos.visibilidadTotal },
    { id: 'calendario', label: 'Calendario', visible: true },
  ].filter(tab => tab.visible);

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'mis-vacaciones':
        return (
          <div className="space-y-6">
            {empleadoActual && (
              <>
                <TarjetasEstadisticasPersonales 
                  empleado={empleadoActual} 
                  solicitudesPendientes={misSolicitudesPendientes}
                />
                
                <div className="mb-6">
                  {empleadoActual && empleadoActual.diasVacacionesDisponibles <= 0 ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                            No tienes días de vacaciones disponibles
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Has utilizado {empleadoActual.diasVacacionesUsados} de {empleadoActual.diasVacacionesAnuales} días asignados para este año.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalAbierto(true)}
                      disabled={!empleadoActual || empleadoActual.diasVacacionesDisponibles <= 0}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                        empleadoActual && empleadoActual.diasVacacionesDisponibles > 0
                          ? 'text-blue-600 hover:text-blue-700'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Nueva solicitud de vacaciones
                    </button>
                  )}
                </div>

                <TablaSolicitudesPersonales
                  solicitudes={solicitudesVisibles.filter(s => s.empleadoId === usuarioActual?.id)}
                  empleados={empleados}
                  empleadoActual={empleadoActual}
                  onEliminar={handleEliminarSolicitud}
                  loading={loading}
                />
              </>
            )}
          </div>
        );

      case 'solicitudes':
        return (
          <div className="space-y-6">
            <ListaSolicitudesPendientes
              solicitudes={solicitudesPendientes}
              empleados={empleados}
              onAprobar={handleAprobarSolicitud}
              onRechazar={handleRechazarSolicitud}
              loading={loadingAprobacion}
            />
          </div>
        );

      case 'historial':
        return (
          <div className="space-y-6">
            <HistorialVacaciones
              solicitudes={historialCompleto}
              empleados={empleados}
            />
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            <VistaPersonal empleados={empleadosVisibles} />
          </div>
        );

      case 'calendario':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Calendario de Vacaciones
            </h2>
            <div className="bg-white dark:bg-boxdark rounded-2xl p-6 border border-gray-100 dark:border-strokedark">
              <p className="text-gray-500">Vista de calendario en desarrollo...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!usuarioActual || !empleadoActual) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontró información del usuario
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Por favor, contacte al administrador del sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Firebase Status */}
      <div className="fixed top-4 right-4 z-50">
        <FirebaseStatus />
      </div>

      {/* Mostrar errores globales */}
      {error && (
        <AlertaVacaciones
          type="error"
          message={error}
          onClose={() => {}}
        />
      )}

      {/* Mostrar mensajes de éxito/error */}
      {mensaje && (
        <AlertaVacaciones
          type={mensaje.tipo}
          message={mensaje.texto}
          onClose={() => setMensaje(null)}
        />
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header con información del usuario y controles */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            {/* Selector de usuario encima del nombre */}
            <div className="mb-3">
              <SelectorUsuario />
            </div>
            
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {usuarioActual.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Bienvenido {usuarioActual.nombre} {usuarioActual.apellidos}
            </h1>
          </div>
        </div>

        {/* Modal de instrucciones */}
        {mostrarInstrucciones && (
          <InstruccionesPrueba onClose={() => setMostrarInstrucciones(false)} />
        )}

        {/* Pestañas de navegación */}
        <div className="mb-8">
          <nav className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id as TabType)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    tabActiva === tab.id
                      ? 'bg-gray-800 text-white shadow-lg dark:bg-white dark:text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Contenido de la pestaña activa */}
        {renderTabContent()}
      </div>

      {/* Modal de nueva solicitud */}
      {empleadoActual && (
        <ModalNuevaSolicitud
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          empleado={empleadoActual}
          onSubmit={handleCrearSolicitud}
          loading={loading}
        />
      )}

      {/* Modal de cancelar solicitud */}
      {solicitudACancelar && (
        <ModalCancelarSolicitud
          isOpen={modalCancelarAbierto}
          onClose={() => {
            setModalCancelarAbierto(false);
            setSolicitudACancelar(null);
          }}
          onConfirm={handleConfirmarCancelacion}
          loading={loading}
          solicitudId={solicitudACancelar}
        />
      )}
    </div>
  );
}
