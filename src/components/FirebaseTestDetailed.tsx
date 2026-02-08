"use client";

import { useState } from 'react';

export default function FirebaseTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testFirebase = async () => {
    setLogs([]);
    setTesting(true);
    
    try {
      addLog('🔄 Iniciando prueba de Firebase...');

      // Paso 1: Verificar variables de entorno
      addLog('📋 Verificando variables de entorno...');
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      if (!config.apiKey) {
        addLog('❌ ERROR: NEXT_PUBLIC_FIREBASE_API_KEY no está definida');
        return;
      }
      if (!config.projectId) {
        addLog('❌ ERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID no está definida');
        return;
      }

      addLog(`✅ Variables OK - Proyecto: ${config.projectId}`);

      // Paso 2: Importar Firebase
      addLog('📦 Importando Firebase...');
      const { initializeApp } = await import('firebase/app');
      const { getFirestore } = await import('firebase/firestore');
      const { getAuth } = await import('firebase/auth');
      
      addLog('✅ Imports de Firebase exitosos');

      // Paso 3: Inicializar Firebase
      addLog('🔥 Inicializando Firebase...');
      const app = initializeApp(config);
      addLog('✅ Firebase App inicializada');

      // Paso 4: Inicializar servicios
      addLog('🔧 Inicializando Auth...');
      const auth = getAuth(app);
      addLog('✅ Auth inicializado');

      addLog('🔧 Inicializando Firestore...');
      const db = getFirestore(app);
      addLog('✅ Firestore inicializado');

      // Paso 5: Probar operación básica
      addLog('🧪 Probando operación de escritura...');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
      const testCollection = collection(db, 'test_connection');
      const docRef = await addDoc(testCollection, {
        mensaje: 'Prueba desde diagnóstico',
        timestamp: serverTimestamp(),
        fecha: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A'
      });

      addLog(`🎉 ¡ÉXITO! Documento creado con ID: ${docRef.id}`);
      addLog(`✅ Firebase está funcionando correctamente`);

    } catch (error: any) {
      addLog(`❌ ERROR: ${error.message}`);
      console.error('Error completo:', error);

      // Diagnóstico específico de errores comunes
      if (error.message.includes('Missing or insufficient permissions')) {
        addLog('💡 Solución: Verifica las reglas de Firestore Database');
        addLog('💡 Ve a Firebase Console > Firestore Database > Rules');
      } else if (error.message.includes('Project not found')) {
        addLog('💡 Solución: Verifica que el proyecto existe en Firebase Console');
      } else if (error.message.includes('API key not valid')) {
        addLog('💡 Solución: Verifica la API key en Firebase Console');
      } else if (error.message.includes('Network request failed')) {
        addLog('💡 Solución: Verifica tu conexión a internet');
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🔍 Diagnóstico Completo de Firebase
        </h2>

        <button
          onClick={testFirebase}
          disabled={testing}
          className="w-full mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {testing ? '🔄 Ejecutando pruebas...' : '🚀 Ejecutar Diagnóstico Completo'}
        </button>

        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">Presiona el botón para ejecutar el diagnóstico...</p>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  log.includes('❌') ? 'text-red-400' :
                  log.includes('✅') ? 'text-green-400' :
                  log.includes('🎉') ? 'text-yellow-400' :
                  log.includes('💡') ? 'text-blue-400' :
                  'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>

        {/* Información del sistema */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Información del Sistema:
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
            <p><strong>Proyecto ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No definido'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}