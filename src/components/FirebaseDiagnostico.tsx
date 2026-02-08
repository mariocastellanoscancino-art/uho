"use client";

import React, { useState, useEffect } from 'react';

export default function FirebaseDiagnostico() {
  const [diagnostico, setDiagnostico] = useState<{
    variablesEntorno: Record<string, string>;
    erroresInicializacion: string[];
    estadoConexion: string;
  }>({
    variablesEntorno: {},
    erroresInicializacion: [],
    estadoConexion: 'Verificando...'
  });

  useEffect(() => {
    const verificarFirebase = async () => {
      try {
        // 1. Verificar variables de entorno
        const variables = {
          NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NO DEFINIDA',
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NO DEFINIDA',
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NO DEFINIDA',
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'NO DEFINIDA',
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'NO DEFINIDA',
          NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'NO DEFINIDA',
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'NO DEFINIDA'
        };

        const errores = [];
        
        // 2. Verificar que no falten variables
        Object.entries(variables).forEach(([key, value]) => {
          if (value === 'NO DEFINIDA') {
            errores.push(`Variable ${key} no está definida`);
          }
        });

        // 3. Intentar importar y usar Firebase
        try {
          const { auth, db } = await import('@/lib/firebase');
          
          if (!auth) {
            errores.push('Firebase Auth no se pudo inicializar');
          }
          
          if (!db) {
            errores.push('Firestore no se pudo inicializar');
          }

          // 4. Verificar conectividad
          if (auth && db) {
            // Probar una operación simple
            const testAuth = auth.currentUser;
            console.log('Estado de auth:', testAuth);
            
            setDiagnostico({
              variablesEntorno: variables,
              erroresInicializacion: errores,
              estadoConexion: errores.length === 0 ? '✅ Firebase conectado correctamente' : '❌ Hay errores de configuración'
            });
          }
        } catch (firebaseError) {
          console.error('Error al importar Firebase:', firebaseError);
          errores.push(`Error al inicializar Firebase: ${firebaseError instanceof Error ? firebaseError.message : 'Error desconocido'}`);
          
          setDiagnostico({
            variablesEntorno: variables,
            erroresInicializacion: errores,
            estadoConexion: '❌ Error al conectar con Firebase'
          });
        }

      } catch (error) {
        console.error('Error en diagnóstico:', error);
        setDiagnostico({
          variablesEntorno: {},
          erroresInicializacion: [`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`],
          estadoConexion: '❌ Error en diagnóstico'
        });
      }
    };

    verificarFirebase();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        🔍 Diagnóstico de Firebase
      </h1>

      {/* Estado General */}
      <div className={`p-4 rounded-lg ${
        diagnostico.estadoConexion.includes('✅') 
          ? 'bg-green-100 border border-green-300 dark:bg-green-900/20' 
          : 'bg-red-100 border border-red-300 dark:bg-red-900/20'
      }`}>
        <h2 className="text-lg font-semibold mb-2">Estado de Conexión</h2>
        <p className={`text-lg ${
          diagnostico.estadoConexion.includes('✅') 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {diagnostico.estadoConexion}
        </p>
      </div>

      {/* Variables de Entorno */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          📝 Variables de Entorno
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(diagnostico.variablesEntorno).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{key}:</span>
              <span className={`font-mono text-sm px-2 py-1 rounded ${
                value === 'NO DEFINIDA' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {value === 'NO DEFINIDA' ? value : `${String(value).substring(0, 20)}...`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Errores */}
      {diagnostico.erroresInicializacion.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300">
          <h2 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">
            ⚠️ Errores Encontrados
          </h2>
          <ul className="space-y-2">
            {diagnostico.erroresInicializacion.map((error, index) => (
              <li key={index} className="text-red-700 dark:text-red-300 text-sm">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Soluciones Sugeridas */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300">
        <h2 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
          💡 Soluciones Sugeridas
        </h2>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
          <li>• Verifica que el archivo .env.local esté en la raíz del proyecto</li>
          <li>• Asegúrate de que no haya espacios extra o comillas en las variables</li>
          <li>• Reinicia el servidor de desarrollo después de cambiar .env.local</li>
          <li>• Verifica que el proyecto Firebase esté activo en Firebase Console</li>
          <li>• Revisa que Authentication y Firestore estén habilitados</li>
        </ul>
      </div>

      {/* Información del Navegador */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          🌐 Información del Entorno
        </h2>
        <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'No disponible'}</p>
          <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'No disponible'}</p>
          <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}