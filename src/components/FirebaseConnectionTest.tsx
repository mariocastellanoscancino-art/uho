"use client";

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface FirebaseTestProps {
  className?: string;
}

export default function FirebaseConnectionTest({ className = "" }: FirebaseTestProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string>("");
  const [firestoreTest, setFirestoreTest] = useState<string>("");

  // Monitorear estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setTestResult(`✅ Usuario conectado: ${currentUser.email}`);
      } else {
        setTestResult("❌ No hay usuario conectado");
      }
    });

    return () => unsubscribe();
  }, []);

  // Probar conexión a Firestore
  const testFirestore = async () => {
    try {
      setFirestoreTest("🔄 Probando conexión a Firestore...");
      
      // Intentar escribir un documento de prueba
      const testCollection = collection(db, 'test_connection');
      const docRef = await addDoc(testCollection, {
        mensaje: 'Conexión de prueba exitosa',
        timestamp: serverTimestamp(),
        fecha: new Date().toISOString()
      });

      // Leer documentos de la colección de prueba
      const querySnapshot = await getDocs(testCollection);
      const docCount = querySnapshot.size;

      setFirestoreTest(`✅ Firestore conectado correctamente! Documentos en test_connection: ${docCount}`);
    } catch (error) {
      console.error("Error probando Firestore:", error);
      setFirestoreTest(`❌ Error en Firestore: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Función de login de prueba (opcional)
  const testLogin = async () => {
    try {
      setTestResult("🔄 Probando autenticación...");
      // Aquí puedes agregar credenciales de prueba si las tienes
      const email = "test@example.com";
      const password = "password123";
      
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error en login de prueba:", error);
      setTestResult(`❌ Error de autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
        <h3 className="text-lg font-semibold mb-4">🔥 Probando conexión Firebase</h3>
        <p className="text-gray-600">Cargando estado de Firebase...</p>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-4">🔥 Estado de conexión Firebase</h3>
      
      {/* Estado de Autenticación */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Autenticación:</h4>
        <p className={`text-sm p-2 rounded ${
          user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {testResult}
        </p>
        {user && (
          <div className="mt-2 text-xs text-gray-600">
            <p>UID: {user.uid}</p>
            <p>Email verificado: {user.emailVerified ? '✅' : '❌'}</p>
          </div>
        )}
      </div>

      {/* Estado de Firestore */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Firestore:</h4>
        <button 
          onClick={testFirestore}
          className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Probar Firestore
        </button>
        {firestoreTest && (
          <p className={`text-sm p-2 rounded ${
            firestoreTest.includes('✅') ? 'bg-green-100 text-green-800' : 
            firestoreTest.includes('❌') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {firestoreTest}
          </p>
        )}
      </div>

      {/* Información del proyecto */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="font-medium text-gray-700 mb-2">Configuración del proyecto:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Proyecto:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          <p><strong>Dominio:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
          <p><strong>Estado:</strong> {auth.app ? '✅ Inicializado' : '❌ No inicializado'}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-4 flex gap-2">
        {user && (
          <button 
            onClick={() => signOut(auth)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}