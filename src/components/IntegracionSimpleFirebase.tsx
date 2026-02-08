"use client";

import React, { useState } from 'react';
import { useFirebaseVacationsUholidays3 } from '@/hooks/useFirebaseVacationsUholidays3';

export default function IntegracionSimpleFirebase() {
  const {
    loading,
    error,
    solicitudes,
    crearSolicitudVacaciones,
    obtenerSolicitudes,
    probarConexion
  } = useFirebaseVacationsUholidays3();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const ejecutarPruebaSimple = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      addTestResult('🔄 Probando conexión a uholidays3...');
      const conexionOk = await probarConexion();
      
      if (conexionOk) {
        addTestResult('✅ Conexión exitosa a uholidays3');
        
        addTestResult('📝 Creando solicitud de prueba...');
        const solicitudPrueba = {
          empleadoId: 'test_user_001',
          diasSolicitados: 3,
          motivo: 'Vacaciones de prueba',
          estado: 'pendiente' as const,
          fechaSolicitud: new Date(),
          fechaInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          fechaFin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        };

        const id = await crearSolicitudVacaciones(solicitudPrueba);
        addTestResult(`✅ Solicitud creada con ID: ${id}`);
        
        addTestResult('📖 Obteniendo solicitudes...');
        const todas = await obtenerSolicitudes();
        addTestResult(`✅ ${todas.length} solicitudes encontradas`);
        
        addTestResult('🎉 ¡Firebase conectado exitosamente!');
      } else {
        addTestResult('❌ Error en conexión');
      }
    } catch (error: any) {
      addTestResult(`❌ Error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          🔥 Firebase uholidays3 + Vacaciones
        </h1>
        <p className="opacity-90">
          Integración completa de tu sistema de vacaciones con Firebase
        </p>
      </div>

      {/* Prueba Simple */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">🚀 Prueba de Integración</h2>
        
        <button
          onClick={ejecutarPruebaSimple}
          disabled={testing || loading}
          className="w-full mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
        >
          {testing ? '🔄 Probando...' : '🚀 Probar Conexión y Crear Solicitud'}
        </button>

        {/* Resultados */}
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-400">Haz clic para probar la integración...</p>
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

      {/* Solicitudes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📋 Solicitudes en Firebase</h2>
          <button
            onClick={obtenerSolicitudes}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 rounded text-red-800 dark:text-red-300">
            Error: {error}
          </div>
        )}

        {solicitudes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No hay solicitudes. Crea una con el botón de arriba.
          </p>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="border border-gray-200 dark:border-gray-600 rounded p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{solicitud.motivo}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {solicitud.empleadoId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    solicitud.estado === 'aprobado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    solicitud.estado === 'rechazado' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {solicitud.estado}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Días:</span> {solicitud.diasSolicitados}
                  </div>
                  <div>
                    <span className="text-gray-500">Desde:</span> {solicitud.fechaInicio.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          ✅ ¿Qué hace esta integración?
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
          <li>• Se conecta a tu proyecto Firebase "uholidays3"</li>
          <li>• Crea solicitudes de vacaciones en la base de datos</li>
          <li>• Permite obtener y mostrar todas las solicitudes</li>
          <li>• Guarda toda la información en tiempo real</li>
          <li>• Está listo para integrar con tu sistema existente</li>
        </ul>
      </div>
    </div>
  );
}