"use client";

import { useState, useEffect } from 'react';

interface FirebaseStatusProps {
  className?: string;
}

export default function FirebaseStatus({ className = "" }: FirebaseStatusProps) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [message, setMessage] = useState('Conectando a Firebase...');

  useEffect(() => {
    // Probar conexión a Firebase
    const testFirebaseConnection = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        
        // Crear un documento de prueba
        await addDoc(collection(db, 'connection_test'), {
          timestamp: serverTimestamp(),
          test: true
        });

        setStatus('connected');
        setMessage('Conectado a Firebase uholidays3');
      } catch (error) {
        setStatus('error');
        setMessage('Error de conexión a Firebase');
        console.error('Error Firebase:', error);
      }
    };

    testFirebaseConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '✅';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'connecting' ? 'animate-pulse' : ''}`}></div>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {getStatusIcon()} {message}
      </span>
    </div>
  );
}