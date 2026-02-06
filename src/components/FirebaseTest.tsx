"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState('🔄 Conectando a Firebase...');
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<any[]>([]);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setStatus('🔄 Conectando a Firestore...');
      console.log('🔥 Iniciando prueba de conexión a Firebase');
      
      // Test de escritura
      const testDoc = {
        test: true,
        timestamp: new Date(),
        message: 'Conexión exitosa!',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        testNumber: Math.floor(Math.random() * 1000)
      };

      console.log('📝 Escribiendo documento de prueba...');
      await addDoc(collection(db, 'test'), testDoc);
      console.log('✅ Documento escrito exitosamente');
      
      // Test de lectura
      console.log('📖 Leyendo documentos...');
      const snapshot = await getDocs(collection(db, 'test'));
      const count = snapshot.size;
      console.log(`📊 Documentos encontrados: ${count}`);

      setStatus(`✅ Conexión exitosa! Documentos de prueba: ${count}`);
      setError(null);

      // Configurar listener en tiempo real
      const unsubscribe = onSnapshot(collection(db, 'test'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestData(data);
        console.log('🔄 Datos actualizados en tiempo real:', data.length, 'documentos');
      });

      return unsubscribe;
      
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      
      let errorMessage = error.message || 'Error desconocido';
      
      // Mensajes más específicos para errores comunes
      if (errorMessage.includes('permission-denied')) {
        errorMessage = '🔒 Permisos denegados. Ve a Firebase Console → Firestore Database → Reglas → Cambiar a modo de prueba';
      } else if (errorMessage.includes('not-found')) {
        errorMessage = '🗄️ Firestore no configurado. Ve a Firebase Console → Firestore Database → Crear base de datos';
      } else if (errorMessage.includes('Failed to get document')) {
        errorMessage = '📡 Error de conexión. Verifica que Firestore esté habilitado en Firebase Console';
      } else if (errorMessage.includes('network')) {
        errorMessage = '🌐 Error de red. Verifica tu conexión a internet';
      }
      
      setError(errorMessage);
      setStatus('❌ Error de conexión');
    }
  };

  const createTestEmployee = async () => {
    try {
      const testEmployee = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@ejemplo.com',
        departamento: 'IT',
        fechaIngreso: new Date(),
        diasDisponibles: 20,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'empleados'), testEmployee);
      setStatus('✅ Empleado de prueba creado');
    } catch (error: any) {
      setError(`Error creando empleado: ${error.message}`);
    }
  };

  const createTestRequest = async () => {
    try {
      const testRequest = {
        empleadoId: 'test-user',
        empleadoNombre: 'Usuario de Prueba',
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
        diasSolicitados: 7,
        motivo: 'Vacaciones familiares',
        estado: 'pendiente',
        tipoVacaciones: 'anuales',
        fechaSolicitud: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'solicitudes_vacaciones'), testRequest);
      setStatus('✅ Solicitud de prueba creada');
    } catch (error: any) {
      setError(`Error creando solicitud: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-boxdark rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🔥 Test de Firebase</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="font-semibold text-gray-900 dark:text-white">Estado:</p>
          <p className="text-gray-700 dark:text-gray-300">{status}</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="font-semibold text-red-800 dark:text-red-200">Error:</p>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="font-semibold text-blue-800 dark:text-blue-200">Configuración:</p>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Proyecto:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
            <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
            <p><strong>Modo:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={testFirebaseConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Probar conexión
          </button>
          <button 
            onClick={createTestEmployee}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            👤 Crear empleado de prueba
          </button>
          <button 
            onClick={createTestRequest}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            📝 Crear solicitud de prueba
          </button>
        </div>

        {testData.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="font-semibold text-green-800 dark:text-green-200 mb-2">Datos en tiempo real ({testData.length}):</p>
            <div className="max-h-40 overflow-y-auto">
              {testData.map((item, index) => (
                <div key={item.id || index} className="text-sm text-green-700 dark:text-green-300 mb-1 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                  <p><strong>ID:</strong> {item.id}</p>
                  <p><strong>Mensaje:</strong> {item.message || item.nombre || 'Sin mensaje'}</p>
                  <p><strong>Timestamp:</strong> {item.timestamp?.toDate?.()?.toLocaleString() || item.createdAt?.toDate?.()?.toLocaleString() || 'Sin fecha'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          <p><strong>Instrucciones si hay errores:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Ve a <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-600 hover:underline">Firebase Console</a></li>
            <li>Selecciona el proyecto "uholidyas-vacaciones"</li>
            <li>Ve a "Firestore Database" en el menú lateral</li>
            <li>Si no está creada, haz clic en "Crear base de datos"</li>
            <li>Ve a la pestaña "Reglas" y cambia <code>allow read, write: if false;</code> por <code>allow read, write: if true;</code></li>
            <li>Haz clic en "Publicar"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
