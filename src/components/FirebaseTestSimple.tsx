"use client";

import React, { useState } from 'react';

export default function FirebaseTestSimple() {
  const [resultado, setResultado] = useState<string>('Presiona el botón para probar');
  const [loading, setLoading] = useState(false);

  const probarConexion = async () => {
    setLoading(true);
    setResultado('🔄 Probando conexión...');

    try {
      // Verificar variables de entorno
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      console.log('Configuración Firebase:', config);

      if (!config.apiKey || !config.projectId) {
        setResultado('❌ Error: Variables de entorno no configuradas correctamente');
        return;
      }

      // Importar dinámicamente para evitar errores de servidor
      const { initializeApp } = await import('firebase/app');
      const { getAuth, connectAuthEmulator } = await import('firebase/auth');
      const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');

      // Inicializar Firebase manualmente
      const app = initializeApp(config);
      const auth = getAuth(app);
      const db = getFirestore(app);

      setResultado(`✅ Firebase conectado correctamente al proyecto: ${config.projectId}`);
      
      // Probar una operación simple con Firestore
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
      try {
        const testCol = collection(db, 'test_connection');
        const docRef = await addDoc(testCol, {
          mensaje: 'Prueba de conexión',
          timestamp: serverTimestamp(),
          fecha: new Date().toISOString()
        });
        
        setResultado(`✅ Firebase y Firestore funcionando correctamente! ID del documento: ${docRef.id}`);
      } catch (firestoreError) {
        console.error('Error en Firestore:', firestoreError);
        setResultado(`⚠️ Firebase conectado pero Firestore falló: ${firestoreError instanceof Error ? firestoreError.message : 'Error desconocido'}`);
      }

    } catch (error) {
      console.error('Error completo:', error);
      setResultado(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        🧪 Prueba Simple de Firebase
      </h2>
      
      <button 
        onClick={probarConexion}
        disabled={loading}
        className="w-full mb-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '🔄 Probando...' : '🚀 Probar Conexión Firebase'}
      </button>

      <div className={`p-4 rounded-lg border ${
        resultado.includes('✅') 
          ? 'bg-green-50 border-green-300 dark:bg-green-900/20'
          : resultado.includes('❌')
          ? 'bg-red-50 border-red-300 dark:bg-red-900/20'
          : resultado.includes('⚠️')
          ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20'
          : 'bg-gray-50 border-gray-300 dark:bg-gray-900/20'
      }`}>
        <p className={`text-sm font-mono ${
          resultado.includes('✅') 
            ? 'text-green-800 dark:text-green-200'
            : resultado.includes('❌')
            ? 'text-red-800 dark:text-red-200'
            : resultado.includes('⚠️')
            ? 'text-yellow-800 dark:text-yellow-200'
            : 'text-gray-800 dark:text-gray-200'
        }`}>
          {resultado}
        </p>
      </div>

      {/* Información de depuración */}
      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
        <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">Información de depuración:</p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Proyecto ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No definido'}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'No definido'}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>API Key presente:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Sí' : 'No'}
        </p>
      </div>
    </div>
  );
}