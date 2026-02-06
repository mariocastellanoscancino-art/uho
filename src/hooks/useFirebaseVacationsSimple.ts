"use client";

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interfaces simplificadas
export interface SolicitudVacacionesSimple {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasSolicitados: number;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';
  fechaSolicitud: Date;
  tipoVacaciones: 'anuales' | 'personales' | 'medicas';
  createdAt: Date;
  updatedAt: Date;
}

export function useFirebaseVacationsSimple() {
  const [solicitudes, setSolicitudes] = useState<SolicitudVacacionesSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear nueva solicitud sin autenticación
  const crearSolicitud = async (datos: {
    fechaInicio: Date;
    fechaFin: Date;
    diasSolicitados: number;
    motivo: string;
    tipoVacaciones: 'anuales' | 'personales' | 'medicas';
    empleadoId?: string;
    empleadoNombre?: string;
  }): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const nuevaSolicitud = {
        empleadoId: datos.empleadoId || 'emp-' + Date.now(),
        empleadoNombre: datos.empleadoNombre || 'Usuario de prueba',
        fechaInicio: Timestamp.fromDate(datos.fechaInicio),
        fechaFin: Timestamp.fromDate(datos.fechaFin),
        diasSolicitados: datos.diasSolicitados,
        motivo: datos.motivo,
        estado: 'pendiente',
        fechaSolicitud: Timestamp.fromDate(new Date()),
        tipoVacaciones: datos.tipoVacaciones,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      console.log('📝 Creando solicitud en Firebase:', nuevaSolicitud);
      
      const docRef = await addDoc(collection(db, 'solicitudes_vacaciones'), nuevaSolicitud);
      console.log('✅ Solicitud creada con ID:', docRef.id);
      
      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear solicitud';
      console.error('❌ Error creando solicitud:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Configurar listener para solicitudes en tiempo real
  useEffect(() => {
    console.log('🔄 Configurando listener de Firebase...');
    
    const solicitudesQuery = query(
      collection(db, 'solicitudes_vacaciones'),
      orderBy('fechaSolicitud', 'desc')
    );

    const unsubscribe = onSnapshot(
      solicitudesQuery,
      (snapshot) => {
        console.log('📊 Datos recibidos de Firebase:', snapshot.size, 'documentos');
        
        const solicitudesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fechaInicio: data.fechaInicio.toDate(),
            fechaFin: data.fechaFin.toDate(),
            fechaSolicitud: data.fechaSolicitud.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as SolicitudVacacionesSimple;
        });
        
        setSolicitudes(solicitudesData);
        console.log('✅ Solicitudes actualizadas:', solicitudesData.length);
      },
      (err) => {
        console.error('❌ Error en listener:', err);
        setError(err.message);
      }
    );

    return () => {
      console.log('🛑 Desconectando listener de Firebase');
      unsubscribe();
    };
  }, []);

  // Función para aprobar solicitud (simplificada)
  const aprobarSolicitud = async (solicitudId: string, comentarios?: string): Promise<void> => {
    // TODO: implementar
    console.log('Aprobar solicitud:', solicitudId, comentarios);
  };

  // Función para rechazar solicitud (simplificada)
  const rechazarSolicitud = async (solicitudId: string, motivo: string): Promise<void> => {
    // TODO: implementar
    console.log('Rechazar solicitud:', solicitudId, motivo);
  };

  return {
    solicitudes,
    loading,
    error,
    crearSolicitud,
    aprobarSolicitud,
    rechazarSolicitud,
  };
}