"use client";

import React, { useState } from 'react';
import { useVacaciones } from '@/hooks/useVacaciones';
import { useUsuario } from '@/context/UsuarioContext';
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
    obtenerSolicitudesPendientesAprobacion
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
                  <button
                    onClick={() => setModalAbierto(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nueva solicitud de vacaciones
                  </button>
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
              solicitudes={solicitudesVisibles}
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
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {usuarioActual.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Bienvenido {usuarioActual.nombre} {usuarioActual.apellidos}
            </h1>
          </div>
          
          {/* Controles del header */}
          <div className="flex items-center gap-4">
            {/* Selector de usuario para demostración */}
            <SelectorUsuario />
            
            {/* Botón de ayuda */}
            <button
              onClick={() => setMostrarInstrucciones(true)}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
              title="Guía de pruebas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
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
