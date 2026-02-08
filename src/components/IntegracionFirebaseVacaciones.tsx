"use client";

import React, { useState, useContext } from 'react';
import { useFirebaseVacationsUholidays3 } from '@/hooks/useFirebaseVacationsUholidays3';
import { useUsuario } from '@/context/UsuarioContext';

export default function IntegracionFirebaseVacaciones() {
  const { usuarioActual } = useUsuario();
  const {
    loading,
    error,
    solicitudes,
    crearSolicitudVacaciones,
    obtenerSolicitudes,
    actualizarEstadoSolicitud,
    probarConexion
  } = useFirebaseVacationsUholidays3();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const ejecutarPruebaCompleta = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      addTestResult('🔄 Iniciando prueba de integración completa...');

      // Paso 1: Probar conexión
      addTestResult('📡 Probando conexión a Firebase uholidays3...');
      const conexionOk = await probarConexion();
      if (!conexionOk) {
        addTestResult('❌ Error en conexión básica');
        return;
      }
      addTestResult('✅ Conexión básica exitosa');

      // Paso 2: Crear solicitud de prueba
      addTestResult('📝 Creando solicitud de vacaciones de prueba...');
      const solicitudPrueba = {
        empleadoId: usuarioActual?.id || 'test_user',
        diasSolicitados: 5,
        motivo: 'Vacaciones de prueba Firebase',
        fechaSolicitud: new Date(),
        fechaInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
        fechaFin: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // +12 días
        comentarios: 'Solicitud creada desde integración Firebase'
      };

      const solicitudId = await crearSolicitudVacaciones(solicitudPrueba);
      addTestResult(`✅ Solicitud creada con ID: ${solicitudId}`);

      // Paso 3: Obtener solicitudes
      addTestResult('📖 Obteniendo todas las solicitudes...');
      const todasSolicitudes = await obtenerSolicitudes();
      addTestResult(`✅ ${todasSolicitudes.length} solicitudes encontradas`);

      // Paso 4: Actualizar estado (si hay una solicitud)
      if (solicitudId) {
        addTestResult('🔄 Actualizando estado de solicitud...');
        await actualizarEstadoSolicitud(solicitudId, 'aprobado', 'Aprobado por prueba de integración');
        addTestResult('✅ Estado actualizado correctamente');
      }

      addTestResult('🎉 ¡Integración completa exitosa!');
      addTestResult('✅ Tu sistema de vacaciones está conectado a Firebase uholidays3');

    } catch (error: any) {
      addTestResult(`❌ Error en prueba: ${error.message}`);
      console.error('Error en prueba completa:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          🔥 Integración Firebase + Sistema de Vacaciones
        </h1>
        <p className="opacity-90">
          Conectando tu sistema de vacaciones con Firebase uholidays3
        </p>
      </div>

      {/* Estado del Usuario */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">👤 Estado del Usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <p className="font-medium">Usuario actual:</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {usuarioActual?.nombre || 'No definido'} {usuarioActual?.apellidos || ''}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <p className="font-medium">Tipo:</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {usuarioActual?.tipo || 'No definido'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <p className="font-medium">Departamento:</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {usuarioActual?.departamento || 'No definido'}
            </p>
          </div>
        </div>
      </div>

      {/* Prueba de Integración */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">🧪 Prueba de Integración Completa</h2>
        
        <button
          onClick={ejecutarPruebaCompleta}
          disabled={testing || loading}
          className="w-full mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {testing ? '🔄 Ejecutando pruebas...' : '🚀 Probar Integración Completa'}
        </button>

        {/* Log de pruebas */}
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-400">Presiona el botón para ejecutar la prueba de integración...</p>
          ) : (
            testResults.map((result, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  result.includes('❌') ? 'text-red-400' :
                  result.includes('✅') ? 'text-green-400' :
                  result.includes('🎉') ? 'text-yellow-400' :
                  result.includes('🔄') ? 'text-blue-400' :
                  'text-gray-300'
                }`}
              >
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Estado de Solicitudes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">📋 Solicitudes en Firebase</h2>
        
        <div className="mb-4">
          <button
            onClick={obtenerSolicitudes}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Actualizar Solicitudes'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 rounded text-red-800 dark:text-red-300">
            Error: {error}
          </div>
        )}

        <div className="space-y-3">
          {solicitudes.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hay solicitudes</p>
          ) : (
            solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="border border-gray-200 dark:border-gray-600 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{solicitud.motivo}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    solicitud.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                    solicitud.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {solicitud.estado}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {solicitud.diasSolicitados} días • {solicitud.fechaInicio.toLocaleDateString()} - {solicitud.fechaFin.toLocaleDateString()}
                </p>
                {solicitud.comentarios && (
                  <p className="text-sm text-gray-500 mt-2">{solicitud.comentarios}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}